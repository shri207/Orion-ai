import { IChunk, IRagRetrievalResult } from './RagTypes';
import { RagEmbedder } from './RagEmbedder';
import { logger } from '../../utils/logger';

/**
 * Performs in-memory semantic search over the curriculum index.
 *
 * Algorithm:
 *  1. Embed the query string
 *  2. Compute cosine similarity against every chunk's pre-computed vector
 *  3. Return the top-k chunks, always ensuring the current topic's chunk is included
 */
export class RagRetriever {
  /**
   * Retrieve the most semantically similar curriculum chunks for a given query.
   *
   * @param query    - Free-text query (topic name, candidate answer excerpt, etc.)
   * @param index    - Pre-built array of embedded chunks from RagIndexer
   * @param topicId  - The current interview topic ID — pinned to position 0 in results
   * @param topK     - Maximum number of chunks to return
   */
  public static async retrieve(
    query: string,
    index: IChunk[],
    topicId: string,
    topK: number = 3
  ): Promise<IRagRetrievalResult> {
    if (index.length === 0) {
      return { chunks: [], context: 'No curriculum context available.' };
    }

    const queryVector = await RagEmbedder.embed(query);

    // Score all chunks
    const scored = index.map((chunk) => ({
      chunk,
      score: RagRetriever.cosineSimilarity(queryVector, chunk.vector),
    }));

    // Sort descending by similarity
    scored.sort((a, b) => b.score - a.score);

    // Always include the exact current topic chunk (pin it)
    const pinnedIdx = scored.findIndex((s) => s.chunk.topicId === topicId);
    let selected: typeof scored;

    if (pinnedIdx > 0) {
      // Move the pinned topic to position 0, then take topK - 1 others
      const pinned = scored.splice(pinnedIdx, 1)[0];
      selected = [pinned, ...scored.slice(0, topK - 1)];
    } else {
      selected = scored.slice(0, topK);
    }

    const chunks = selected.map((s) => s.chunk);

    logger.debug(
      {
        topicId,
        retrieved: chunks.map((c) => c.id),
      },
      '[RagRetriever] Retrieved chunks'
    );

    const context = RagRetriever.formatContext(chunks);
    return { chunks, context };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Cosine similarity between two equal-length vectors.
   * Both vectors are expected to be already L2-normalized (as output by all-MiniLM with normalize=true).
   * When normalised, cosine similarity simplifies to a plain dot product.
   */
  private static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }
    return dot; // Already in [-1, 1] since both are unit vectors
  }

  /**
   * Format retrieved chunks into a clean prompt-injectable string.
   */
  private static formatContext(chunks: IChunk[]): string {
    if (chunks.length === 0) return 'No relevant curriculum context found.';

    const lines = chunks.map((c, i) => `[Context ${i + 1}]\n${c.text}`);
    return lines.join('\n\n---\n\n');
  }
}
