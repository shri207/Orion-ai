export interface IWebSocketMessage {
  type: string;
  payload: any;
  sessionId?: string;
}

export interface IWebSocketConnection {
  id: string;
  sessionId: string;
  send(data: string): void;
  on(event: 'message' | 'close' | 'error' | 'pong', listener: (...args: any[]) => void): void;
  close(): void;
  ping(): void;
  terminate(): void;
}

export interface IWebSocketManager {
  addConnection(connection: IWebSocketConnection, sessionId: string): void;
  removeConnection(connectionId: string): void;
  sendMessageToSession(sessionId: string, type: string, payload: any): void;
  broadcast(type: string, payload: any): void;
}
