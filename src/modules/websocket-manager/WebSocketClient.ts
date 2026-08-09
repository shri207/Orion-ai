import { IWebSocketConnection, IWebSocketMessage } from './WebSocketTypes';

export class WebSocketClient {
  public isAlive: boolean = true;

  constructor(
    public readonly connection: IWebSocketConnection,
    public readonly sessionId: string,
    private readonly onDisconnect: (id: string) => void
  ) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.connection.on('pong', () => {
      this.isAlive = true;
    });

    this.connection.on('message', (data: any) => {
      try {
        const message: IWebSocketMessage = JSON.parse(data.toString());
        this.handleMessage(message);
      } catch (error) {
        console.error(`Invalid message format from client ${this.connection.id}`);
      }
    });

    this.connection.on('close', () => {
      this.cleanup();
    });

    this.connection.on('error', (error: any) => {
      console.error(`WebSocket error for client ${this.connection.id}:`, error);
      this.cleanup();
    });
  }

  private handleMessage(message: IWebSocketMessage): void {
    if (message.type === 'PONG') {
      this.isAlive = true;
    }
  }

  public send(type: string, payload: any): void {
    try {
      this.connection.send(JSON.stringify({ type, payload }));
    } catch (error) {
      console.error(`Failed to send message to client ${this.connection.id}:`, error);
    }
  }

  private cleanup(): void {
    this.isAlive = false;
    this.onDisconnect(this.connection.id);
  }
}
