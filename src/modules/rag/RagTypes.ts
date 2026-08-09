/**
 * A single indexed chunk from the curriculum.
 * Each chunk represents one topic (name + description + subtopics flattened into text).
 */
export interface IChunk {
  /** Matches the topic `id` from the curriculum */
  id: string;
  /** Human-readable text used for the embedding */
  text: string;
  /** Original topic ID for fast lookup during retrieval */
  topicId: string;
  /** Dense embedding vector produced by the embedder */
  vector: number[];
}

/**
 * Result of a RAG retrieval call.
 */
export interface IRagRetrievalResult {
  /** Raw chunks sorted by similarity (most relevant first) */
  chunks: IChunk[];
  /**
   * Pre-formatted string ready to inject into a prompt placeholder.
   * Contains the text content of the top-k chunks.
   */
  context: string;
}

/**
 * Public contract for the RAG service used by generators.
 */
export interface IRagService {
  /**
   * Build the in-memory index from a loaded curriculum object.
   * Must be called once before any retrieval.
   */
  initialize(curriculum: unknown): Promise<void>;

  /**
   * Retrieve the most relevant curriculum context for a given topic + query.
   * @param topicId  - Current topic being interviewed on (always included in results)
   * @param query    - Free-text query (e.g. topic name, candidate answer snippet)
   * @param topK     - Number of chunks to return (defaults to env.RAG_TOP_K)
   */
  retrieveContext(topicId: string, query: string, topK?: number): Promise<IRagRetrievalResult>;

  /** Whether the index has been built yet */
  readonly isReady: boolean;
}
