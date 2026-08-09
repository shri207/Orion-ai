import { randomUUID } from 'crypto';
import { SessionId } from './SessionTypes';

export const generateSessionId = (): SessionId => {
  return randomUUID();
};
