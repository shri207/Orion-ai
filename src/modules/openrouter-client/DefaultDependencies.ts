import { ITimeProvider, IHttpClient, IOpenRouterLogger } from './OpenRouterClientInterfaces';
import { IOpenRouterLogContext } from './OpenRouterClientTypes';
import { OpenRouterError, OpenRouterErrorCode } from './OpenRouterError';

export class DefaultTimeProvider implements ITimeProvider {
  public now(): number { return Date.now(); }
  public async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class DefaultLogger implements IOpenRouterLogger {
  public info(message: string, context?: IOpenRouterLogContext): void {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
  }
  public error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }
  public warn(message: string, context?: any): void {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
  }
}

export class FetchHttpClient implements IHttpClient {
  public async post(url: string, headers: Record<string, string>, body: any, timeoutMs: number): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new OpenRouterError(OpenRouterErrorCode.TIMEOUT, 'Request timed out', undefined, true);
      }
      if (err instanceof OpenRouterError) throw err;
      throw new OpenRouterError(OpenRouterErrorCode.NETWORK_ERROR, err.message || 'Network error', undefined, true);
    } finally {
      clearTimeout(timeout);
    }
  }

  public async postStream(url: string, headers: Record<string, string>, body: any, timeoutMs: number): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      clearTimeout(timeout);
      
      if (!response.body) {
         throw new OpenRouterError(OpenRouterErrorCode.PROVIDER_ERROR, 'No response body stream');
      }

      return response.body; 
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new OpenRouterError(OpenRouterErrorCode.TIMEOUT, 'Request timed out', undefined, true);
      }
      if (err instanceof OpenRouterError) throw err;
      throw new OpenRouterError(OpenRouterErrorCode.NETWORK_ERROR, err.message || 'Network error', undefined, true);
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const status = response.status;
    let message = 'Unknown error';
    try {
      const errBody = await response.json();
      message = errBody.error?.message || JSON.stringify(errBody);
    } catch {
      message = response.statusText;
    }

    if (status === 401 || status === 403) {
      throw new OpenRouterError(OpenRouterErrorCode.UNAUTHORIZED, message, status, false);
    } else if (status === 429) {
      throw new OpenRouterError(OpenRouterErrorCode.RATE_LIMIT, message, status, true);
    } else if (status === 400 || status === 422) {
      throw new OpenRouterError(OpenRouterErrorCode.INVALID_REQUEST, message, status, false);
    } else if (status >= 500) {
      throw new OpenRouterError(OpenRouterErrorCode.PROVIDER_ERROR, message, status, true);
    } else {
      throw new OpenRouterError(OpenRouterErrorCode.UNKNOWN, message, status, false);
    }
  }
}
