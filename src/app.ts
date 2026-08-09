import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import hpp from 'hpp';
import { RequestIdMiddleware } from './modules/security/middlewares/RequestIdMiddleware';

import healthRouter    from './routes/health.route';
import interviewRouter from './routes/interview.routes';
import hackathonRouter from './routes/hackathon.routes';
import authRouter      from './routes/auth.routes';
import reportRouter    from './routes/report.routes';
import sessionRouter   from './routes/session.routes';
import curriculumRouter from './routes/curriculum.routes';
import candidatesRouter from './routes/candidates.routes';
import { ErrorMiddleware } from './modules/error-handler';
import { apiKeyMiddleware, jwtAuthMiddleware } from './container';

const app = express();

// 1. Helmet (Security Headers)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// 2. CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : ['*'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// 3. Compression
app.use(compression());

// 4. Request IDs
app.use(RequestIdMiddleware.handle);

// 5. Body parser with strict size limits (1MB for JSON)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. HTTP Parameter Pollution protection
app.use(hpp());

// 7. Basic Request Logging
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`[INCOMING REQUEST] ${req.method} ${req.url} [ID: ${req.headers['x-request-id']}]`);
  next();
});

// Routes
app.use('/health', healthRouter);

// Public API Routes (API key required, no JWT needed)
// Guest auth must be accessible without a JWT token
app.use('/api', apiKeyMiddleware.handle);
app.use('/api/auth', authRouter);

// ── Developer/Hackathon Sandbox ─────────────────────────────────────────────
// Unauthenticated, positioned BEFORE the JWT middleware.
// Exposes POST /api/interview as the Hackathon spec endpoint.
app.use('/api/sandbox/interview', hackathonRouter);

// Protected API Routes (both API key + JWT)
app.use('/api', jwtAuthMiddleware.handle);

app.use('/api/interview',  interviewRouter);
app.use('/api/report',     reportRouter);
app.use('/api/sessions',   sessionRouter);
app.use('/api/curriculum', curriculumRouter);
app.use('/api/candidates', candidatesRouter);

// Global Error Handlers
app.use(ErrorMiddleware.handleNotFound);
app.use(ErrorMiddleware.handle);

export default app;
