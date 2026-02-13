import { Router } from 'express';
import { db } from '../db';
import { sources, highlights, nextActions } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextActionStatus } from '@copilot-2nd-brain/shared';

export const mcpRouter = Router();

// GET /api/mcp/sources - Get all sources
mcpRouter.get('/sources', async (req, res) => {
  try {
    const allSources = await db.select().from(sources).orderBy(desc(sources.createdAt));
    res.json({ sources: allSources });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

// GET /api/mcp/sources/:id - Get source by ID
mcpRouter.get('/sources/:id', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(sources)
      .where(eq(sources.id, req.params.id))
      .limit(1);
    
    if (!result[0]) {
      return res.status(404).json({ error: 'Source not found' });
    }
    
    res.json({ source: result[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch source' });
  }
});

// GET /api/mcp/highlights - Get recent highlights
mcpRouter.get('/highlights', async (req, res) => {
  try {
    const recentHighlights = await db
      .select()
      .from(highlights)
      .orderBy(desc(highlights.date))
      .limit(10);
    
    res.json({ highlights: recentHighlights });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
});

// GET /api/mcp/next-actions - Get pending next actions
mcpRouter.get('/next-actions', async (req, res) => {
  try {
    const actions = await db
      .select()
      .from(nextActions)
      .where(eq(nextActions.status, NextActionStatus.PENDING))
      .orderBy(desc(nextActions.priority), desc(nextActions.createdAt));
    
    res.json({ nextActions: actions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch next actions' });
  }
});

// GET /api/mcp/projects - Get list of projects
mcpRouter.get('/projects', async (req, res) => {
  try {
    const allSources = await db.select().from(sources);
    const projects = [...new Set(allSources.map((s) => s.project).filter(Boolean))];
    
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/mcp/interests - Get interest areas map
mcpRouter.get('/interests', async (req, res) => {
  try {
    const allSources = await db.select().from(sources);
    const interests: Record<string, number> = {};
    
    for (const source of allSources) {
      if (source.category) {
        interests[source.category] = (interests[source.category] || 0) + 1;
      }
    }
    
    res.json({ interests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
});

// POST /api/mcp/search - Semantic search (mock)
mcpRouter.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Mock search: simple text matching
    const allSources = await db.select().from(sources);
    const results = allSources.filter(
      (s) =>
        s.content.toLowerCase().includes(query.toLowerCase()) ||
        (s.summary && s.summary.toLowerCase().includes(query.toLowerCase()))
    );
    
    res.json({ results: results.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// POST /api/mcp/chat - Context-aware AI chat (mock)
mcpRouter.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Mock AI response
    const response = `コンテキストを考慮したAI応答: ${message}に対する回答です。`;
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
});
