import { IDatabaseConnection, ITransaction } from './DatabaseTypes';

export class MockTransaction implements ITransaction {
  public async commit(): Promise<void> {
    console.log('Transaction committed');
  }

  public async rollback(): Promise<void> {
    console.log('Transaction rolled back');
  }
}

export class ConnectionManager implements IDatabaseConnection {
  private isConnected: boolean = false;

  public async connect(): Promise<void> {
    this.isConnected = true;
    console.log('Database connected');
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('Database disconnected');
  }

  public async beginTransaction(): Promise<ITransaction> {
    if (!this.isConnected) {
      throw new Error('Cannot start transaction: Database not connected');
    }
    console.log('Transaction started');
    return new MockTransaction();
  }
}
