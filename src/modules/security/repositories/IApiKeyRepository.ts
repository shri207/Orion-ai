export interface ApiKeyRecord {
  key: string;
  clientId: string;
}

export interface IApiKeyRepository {
  /**
   * Retrieves an API key record by its key string.
   * Returns null if not found.
   */
  findByKey(key: string): Promise<ApiKeyRecord | null>;
}
