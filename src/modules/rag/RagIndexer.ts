import { IChunk } from './RagTypes';
import { RagEmbedder } from './RagEmbedder';
import { logger } from '../../utils/logger';

/**
 * Converts a loaded curriculum object into a flat list of embedded IChunks.
 *
 * Supports both curriculum shapes used in the project:
 *   - `{ days: [{day, title, description, objectives, tools, topics}] }`  (flat day-based)
 *   - `{ modules: [{topics: [{id, name, description, subtopics}]}] }`     (module-based)
 *   - `{ topics: [{id, name, description}] }`                              (simple)
 */
export class RagIndexer {
  /**
   * Build an in-memory vector index from a curriculum.
   * Each topic becomes one chunk; subtopics are inlined into the chunk text.
   */
  public static async buildIndex(curriculum: unknown): Promise<IChunk[]> {
    const topics = RagIndexer.extractTopics(curriculum);

    if (topics.length === 0) {
      logger.warn('[RagIndexer] No topics found in curriculum — RAG index will be empty');
      return [];
    }

    logger.info({ topicCount: topics.length }, '[RagIndexer] Building RAG index — embedding topics...');
    const startMs = Date.now();

    const chunks: IChunk[] = await Promise.all(
      topics.map(async (topic) => {
        const text = RagIndexer.topicToText(topic);
        const vector = await RagEmbedder.embed(text);
        return {
          id: topic.id,
          topicId: topic.id,
          text,
          vector,
        } satisfies IChunk;
      })
    );

    logger.info(
      { topicCount: chunks.length, durationMs: Date.now() - startMs },
      '[RagIndexer] RAG index built successfully'
    );

    return chunks;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private static extractTopics(curriculum: unknown): Array<{
    id: string;
    name: string;
    description: string;
    subtopics?: Array<{ name?: string; description?: string; learningObjectives?: string[] }>;
    objectives?: string[];
    tools?: string[];
  }> {
    const c = curriculum as Record<string, unknown>;

    // Shape 1: day-based curriculum
    if (Array.isArray(c?.days)) {
      return (c.days as Record<string, unknown>[]).map((d) => ({
        id: `day-${d['day']}`,
        name: String(d['title'] ?? `Day ${d['day']}`),
        description: String(d['description'] ?? ''),
        objectives: Array.isArray(d['objectives']) ? (d['objectives'] as string[]) : [],
        tools: Array.isArray(d['tools']) ? (d['tools'] as string[]) : [],
      }));
    }

    // Shape 2: module-based curriculum
    if (Array.isArray(c?.modules)) {
      return (c.modules as Record<string, unknown>[]).flatMap((mod) => {
        const modTopics = Array.isArray(mod['topics']) ? (mod['topics'] as Record<string, unknown>[]) : [];
        return modTopics.map((t) => ({
          id: String(t['id'] ?? ''),
          name: String(t['name'] ?? t['title'] ?? t['id'] ?? ''),
          description: String(t['description'] ?? ''),
          subtopics: Array.isArray(t['subtopics']) ? (t['subtopics'] as Array<{ name?: string; description?: string; learningObjectives?: string[] }>) : [],
        }));
      });
    }

    // Shape 3: simple flat topics array
    if (Array.isArray(c?.topics)) {
      return (c.topics as Record<string, unknown>[]).map((t) => ({
        id: String(t['id'] ?? ''),
        name: String(t['name'] ?? t['title'] ?? t['id'] ?? ''),
        description: String(t['description'] ?? ''),
      }));
    }

    return [];
  }

  /**
   * Convert a topic to a single string that will be embedded.
   * Packing subtopics + objectives gives the model richer context.
   */
  private static topicToText(topic: {
    id: string;
    name: string;
    description: string;
    subtopics?: Array<{ name?: string; description?: string; learningObjectives?: string[] }>;
    objectives?: string[];
    tools?: string[];
  }): string {
    const parts: string[] = [`Topic: ${topic.name}`, `Description: ${topic.description}`];

    if (topic.objectives && topic.objectives.length > 0) {
      parts.push(`Learning objectives: ${topic.objectives.join('; ')}`);
    }

    if (topic.tools && topic.tools.length > 0) {
      parts.push(`Tools covered: ${topic.tools.join(', ')}`);
    }

    if (topic.subtopics && topic.subtopics.length > 0) {
      const subtopicLines = topic.subtopics
        .map((s) => {
          const name = s.name ?? '';
          const desc = s.description ?? '';
          const objs = s.learningObjectives?.join('; ') ?? '';
          return [name, desc, objs].filter(Boolean).join(' — ');
        })
        .filter(Boolean);

      if (subtopicLines.length > 0) {
        parts.push(`Subtopics: ${subtopicLines.join(' | ')}`);
      }
    }

    return parts.join('\n');
  }
}
