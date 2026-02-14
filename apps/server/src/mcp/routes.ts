import { Router } from 'express';
import { db } from '../db';
import { sources, actions, reports } from '../db/schema';
import { desc, and, sql, eq } from 'drizzle-orm';

const router = Router();

// MCP Endpoint: Get thinking history
router.get('/thinking-history', async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    const conditions = [];
    if (startDate) {
      conditions.push(sql`${sources.createdAt} >= ${new Date(startDate as string)}`);
    }
    if (endDate) {
      conditions.push(sql`${sources.createdAt} <= ${new Date(endDate as string)}`);
    }

    let sourcesQuery = db.select().from(sources).orderBy(desc(sources.createdAt));
    if (conditions.length > 0) {
      sourcesQuery = sourcesQuery.where(and(...conditions)) as any;
    }
    const thinkingSources = await sourcesQuery.limit(Number(limit));

    let actionsQuery = db.select().from(actions).orderBy(desc(actions.createdAt));
    if (conditions.length > 0) {
      actionsQuery = actionsQuery.where(and(...conditions)) as any;
    }
    const thinkingActions = await actionsQuery.limit(Number(limit));

    let reportsQuery = db.select().from(reports).orderBy(desc(reports.createdAt));
    if (startDate && endDate) {
      reportsQuery = reportsQuery.where(and(
        sql`${reports.createdAt} >= ${new Date(startDate as string)}`,
        sql`${reports.createdAt} <= ${new Date(endDate as string)}`
      )) as any;
    }
    const thinkingReports = await reportsQuery.limit(Number(limit));

    res.json({
      sources: thinkingSources,
      actions: thinkingActions,
      reports: thinkingReports,
      timeRange: {
        start: startDate || null,
        end: endDate || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thinking history' });
  }
});

// MCP Endpoint: Query accumulated information
router.post('/query', async (req, res) => {
  try {
    const { query, filters, limit = 20 } = req.body;

    // Build query conditions
    const conditions = [];
    
    if (filters?.mediaType && filters.mediaType.length > 0) {
      conditions.push(sql`${sources.mediaType} IN ${filters.mediaType}`);
    }
    
    if (filters?.priority && filters.priority.length > 0) {
      conditions.push(sql`${sources.priority} IN ${filters.priority}`);
    }
    
    if (filters?.projectId) {
      conditions.push(eq(sources.projectId, filters.projectId));
    }
    
    if (filters?.dateRange) {
      conditions.push(
        and(
          sql`${sources.createdAt} >= ${new Date(filters.dateRange.start)}`,
          sql`${sources.createdAt} <= ${new Date(filters.dateRange.end)}`
        )
      );
    }

    // Simple text search in content and summary
    if (query) {
      conditions.push(
        sql`(${sources.content} LIKE ${`%${query}%`} OR ${sources.summary} LIKE ${`%${query}%`})`
      );
    }

    let sourcesQuery = db.select().from(sources).orderBy(desc(sources.createdAt));
    if (conditions.length > 0) {
      sourcesQuery = sourcesQuery.where(and(...conditions)) as any;
    }
    const results = await sourcesQuery.limit(limit);

    // Get relevant actions for these sources
    const sourceIds = results.map(s => s.id);
    const relevantActions = await db.select().from(actions)
      .where(eq(actions.completed, false))
      .limit(10);

    // Generate summary
    const summary = `Found ${results.length} sources matching your query. ${
      relevantActions.length > 0 
        ? `There are ${relevantActions.length} related pending actions.` 
        : ''
    }`;

    res.json({
      results,
      summary,
      relevantActions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to query information' });
  }
});

// MCP Endpoint: Get context for AI
router.get('/context', async (req, res) => {
  try {
    const { topicId, contextSize = 10 } = req.query;

    // Get recent sources for context
    const recentSources = await db.select()
      .from(sources)
      .orderBy(desc(sources.createdAt))
      .limit(Number(contextSize));

    // Get pending actions
    const pendingActions = await db.select()
      .from(actions)
      .where(eq(actions.completed, false))
      .orderBy(desc(actions.priority))
      .limit(Number(contextSize));

    // Get latest report
    const [latestReport] = await db.select()
      .from(reports)
      .orderBy(desc(reports.createdAt))
      .limit(1);

    res.json({
      recentSources,
      pendingActions,
      latestReport: latestReport || null,
      metadata: {
        totalSources: recentSources.length,
        totalPendingActions: pendingActions.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch context' });
  }
});

// MCP Endpoint: Health check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'MCP Server' });
});

export default router;
