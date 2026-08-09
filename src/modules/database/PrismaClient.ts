import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool, PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export class DatabaseClient {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      const { parse } = require('pg-connection-string');
      const config = parse(process.env.DATABASE_URL as string);
      config.password = String(config.password);
      const pool = new Pool(config as PoolConfig);
      const adapter = new PrismaPg(pool);
      DatabaseClient.instance = new PrismaClient({ adapter });
    }
    return DatabaseClient.instance;
  }
}
