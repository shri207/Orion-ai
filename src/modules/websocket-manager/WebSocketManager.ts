import { IWebSocketManager, IWebSocketConnection } from './WebSocketTypes';
import { WebSocketClient } from './WebSocketClient';

export class WebSocketManager implements IWebSocketManager {
  private clients: Map<string, WebSocketClient> = new Map();
  private sessionMap: Map<string, Set<string>> = new Map();
  private heartbeatInterval: NodeJS.Timeout;

  constructor(heartbeatMs: number = 30000) {
    this.heartbeatInterval = setInterval(() => this.checkHeartbeats(), heartbeatMs);
  }

  public addConnection(connection: IWebSocketConnection, sessionId: string): void {
    const client = new WebSocketClient(connection, sessionId, (id) => this.removeConnection(id));
    this.clients.set(connection.id, client);

    if (!this.sessionMap.has(sessionId)) {
      this.sessionMap.set(sessionId, new Set());
    }
    this.sessionMap.get(sessionId)!.add(connection.id);
    
    console.log(`Client ${connection.id} connected to session ${sessionId}`);
  }

  public removeConnection(connectionId: string): void {
    const client = this.clients.get(connectionId);
    if (client) {
      const sessionClients = this.sessionMap.get(client.sessionId);
      if (sessionClients) {
        sessionClients.delete(connectionId);
        if (sessionClients.size === 0) {
          this.sessionMap.delete(client.sessionId);
        }
      }
      this.clients.delete(connectionId);
      console.log(`Client ${connectionId} disconnected`);
    }
  }

  public sendMessageToSession(sessionId: string, type: string, payload: any): void {
    const sessionClients = this.sessionMap.get(sessionId);
    if (sessionClients) {
      sessionClients.forEach(clientId => {
        const client = this.clients.get(clientId);
        if (client) {
          client.send(type, payload);
        }
      });
    }
  }

  public broadcast(type: string, payload: any): void {
    this.clients.forEach(client => {
      client.send(type, payload);
    });
  }

  private checkHeartbeats(): void {
    this.clients.forEach(client => {
      if (!client.isAlive) {
        console.log(`Client ${client.connection.id} is dead. Terminating.`);
        client.connection.terminate();
        this.removeConnection(client.connection.id);
        return;
      }
      client.isAlive = false;
      try {
        client.connection.ping();
      } catch (e) {
        client.send('PING', { timestamp: Date.now() });
      }
    });
  }

  public shutdown(): void {
    clearInterval(this.heartbeatInterval);
    this.clients.forEach(client => {
      client.connection.close();
    });
    this.clients.clear();
    this.sessionMap.clear();
  }
}
