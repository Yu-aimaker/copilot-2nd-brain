import type {
  AISummaryResult,
  AIActionSuggestion,
  CreateSourceInput,
  ReportType,
} from "@2nd-brain/shared";
import { db } from "../db";
import { sources } from "../db/schema";
import { desc } from "drizzle-orm";

/**
 * Process a newly saved source with AI.
 *
 * In production this calls an LLM API (OpenAI, Anthropic, etc.).
 * The scaffold returns deterministic placeholder results so the
 * pipeline is fully wired end-to-end.
 */
export async function processSourceWithAI(
  input: CreateSourceInput
): Promise<AISummaryResult> {
  // TODO: Replace with actual LLM call
  const tags = extractPlaceholderTags(input.content);
  const priority = inferPlaceholderPriority(input.content);

  return {
    summary: `AI summary of: ${input.title.slice(0, 80)}`,
    tags,
    priority,
    projectId: undefined,
  };
}

/**
 * Analyse accumulated sources and suggest concrete next actions.
 */
export async function suggestActions(): Promise<AIActionSuggestion[]> {
  const recentSources = await db
    .select()
    .from(sources)
    .orderBy(desc(sources.createdAt))
    .limit(20);

  if (recentSources.length === 0) return [];

  // TODO: Replace with actual LLM cross-analysis
  return [
    {
      title: "Review recent knowledge entries",
      description:
        "Several new sources were added recently. Review and consolidate overlapping insights.",
      reasoning:
        "Cross-analysis detected thematic overlap among recent entries.",
      priority: "medium",
      relatedSourceIds: recentSources.slice(0, 3).map((s) => s.id),
    },
  ];
}

/**
 * Generate a periodic report (daily / weekly / monthly).
 */
export async function generateReport(type: ReportType) {
  const recentSources = await db
    .select()
    .from(sources)
    .orderBy(desc(sources.createdAt))
    .limit(type === "daily" ? 10 : type === "weekly" ? 30 : 100);

  // TODO: Replace with actual LLM report generation
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Knowledge Report`,
    content: `Report covering ${recentSources.length} sources. Replace this with LLM-generated analysis.`,
    insights: [
      `${recentSources.length} sources analyzed`,
      "Placeholder insight — connect to LLM for real analysis",
    ],
  };
}

// ─── Helper utilities (placeholder) ──────────────────────────
function extractPlaceholderTags(content: string): string[] {
  const words = content.toLowerCase().split(/\s+/);
  const common = new Set(["the", "a", "is", "in", "to", "and", "of", "for"]);
  const freq = new Map<string, number>();
  for (const w of words) {
    if (w.length > 3 && !common.has(w)) {
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function inferPlaceholderPriority(
  content: string
): "high" | "medium" | "low" {
  const len = content.length;
  if (len > 2000) return "high";
  if (len > 500) return "medium";
  return "low";
}
