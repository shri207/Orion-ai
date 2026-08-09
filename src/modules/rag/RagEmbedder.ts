import { logger } from '../../utils/logger';

// Dynamic import keeps this out of the main bundle until actually used
// and prevents TS from complaining about ESM-only package in CJS context.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PipelineFunction = (task: string, model: string, options?: Record<string, unknown>) => Promise<any>;

/**
 * Thin wrapper around @xenova/transformers that:
 *  1. Lazy-loads and caches the pipeline singleton on first use
 *  2. Exposes a simple `embed(text)` API returning a flat `number[]`
 *
 * Model: `Xenova/all-MiniLM-L6-v2`
 *  - Size: ~23 MB (downloaded once, cached in ~/.cache/huggingface)
 *  - Output: 384-dimensional float32 vector
 *  - Runs entirely in Node.js, no Python, no GPU required
 */
export class RagEmbedder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static pipeline: any | null = null;
  private static loading: Promise<void> | null = null;

  private static readonly MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

  /**
   * Ensure the model pipeline is loaded.
   * Safe to call multiple times — only loads once.
   */
  public static async ensureLoaded(): Promise<void> {
    if (this.pipeline) return;
    if (this.loading) {
      await this.loading;
      return;
    }

    this.loading = (async () => {
      logger.info({ model: this.MODEL_NAME }, '[RagEmbedder] Loading embedding model (first run may download ~23 MB)...');
      const startMs = Date.now();

      // Dynamic import — @xenova/transformers is ESM-only
      const { pipeline, env: xEnv } = await import('@xenova/transformers');

      // Silence verbose progress bars in production logs
      xEnv.allowLocalModels = false;

      const pipelineFactory = pipeline as PipelineFunction;
      this.pipeline = await pipelineFactory('feature-extraction', this.MODEL_NAME, {
        quantized: true, // Use ONNX quantized model — faster and smaller
      });

      logger.info({ model: this.MODEL_NAME, durationMs: Date.now() - startMs }, '[RagEmbedder] Embedding model loaded');
    })();

    await this.loading;
  }

  /**
   * Embed a piece of text into a dense vector.
   * Mean-pools the last hidden state (standard sentence-transformers approach).
   */
  public static async embed(text: string): Promise<number[]> {
    await this.ensureLoaded();

    const output = await this.pipeline!(text, {
      pooling: 'mean',
      normalize: true,
    });

    // output.data is a Float32Array — convert to plain number[]
    return Array.from(output.data as Float32Array);
  }
}
