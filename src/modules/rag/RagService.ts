import { IChunk, IRagRetrievalResult, IRagService } from './RagTypes';
import { RagIndexer } from './RagIndexer';
import { RagRetriever } from './RagRetriever';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

/**
 * High-level RAG service that ties indexing and retrieval together.
 *
 * Lifecycle:
 *   1. Call `initialize(curriculum)` once at startup (after curriculum is loaded).
 *   2. Call `retrieveContext(topicId, query)` for every question/follow-up generation.
 *
 * Thread-safety: Node.js is single-threaded, so the in-memory index is safe to share.
 */
export class RagService implements IRagService {
  private index: IChunk[] = [];
  private _isReady = false;

  public get isReady(): boolean {
    return this._isReady;
  }

  /**
   * Build the vector index from the loaded curriculum.
   * Must be called before any retrieval. Safe to call multiple times
   * (will re-build the index — useful if the curriculum is hot-reloaded).
   */
  public async initialize(curriculum: unknown): Promise<void> {
    logger.info('[RagService] Initializing RAG index...');
    try {
      this.index = await RagIndexer.buildIndex(curriculum);
      this._isReady = true;
      logger.info({ chunks: this.index.length }, '[RagService] RAG index ready');
    } catch (error) {
      logger.error({ error }, '[RagService] Failed to build RAG index — RAG will be disabled for this session');
      this._isReady = false;
    }
  }

  /**
   * Retrieve the most relevant curriculum context for a query.
   * Returns an empty context string if the index is not ready.
   *
   * @param topicId - The current interview topic (always pinned in results)
   * @param query   - Semantic query (e.g. topic name, candidate answer excerpt)
   * @param topK    - Number of chunks to return (defaults to `env.RAG_TOP_K`)
   */
  public async retrieveContext(
    topicId: string,
    query: string,
    topK?: number
  ): Promise<IRagRetrievalResult> {
    if (!this._isReady || this.index.length === 0) {
      logger.warn('[RagService] Index not ready — returning empty context');
      return { chunks: [], context: 'No curriculum context available.' };
    }

    const k = topK ?? env.RAG_TOP_K;
    return RagRetriever.retrieve(query, this.index, topicId, k);
  }
}

/**
 * Application-level singleton.
 * Import and use `ragService` everywhere — call `initialize()` once at startup.
 */
export const ragService = new RagService();
