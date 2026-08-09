import { Router } from 'express';

import { stateStore } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const redisHealthy = await stateStore.ping();
  
  const status = redisHealthy ? 'ok' : 'degraded';
  
  res.status(redisHealthy ? 200 : 503).json({
    status,
    uptime: process.uptime(),
    redis: redisHealthy ? 'connected' : 'disconnected'
  });
});

export default router;
