import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

const CURRICULUM_DIR = path.resolve(__dirname, '../data/curriculum');

/** Read and parse one JSON file; returns null on error */
async function readJsonFile(filePath: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * GET /api/curriculum
 * Returns all curriculum modules from the data/curriculum directory.
 * Each module contains topics, subtopics, and learning objectives.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let files: string[] = [];
    try {
      files = await fs.readdir(CURRICULUM_DIR);
    } catch {
      // Directory might not exist in some environments
    }

    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const allModules: any[] = [];

    for (const file of jsonFiles) {
      const data = await readJsonFile(path.join(CURRICULUM_DIR, file));
      if (data?.modules) {
        allModules.push(
          ...data.modules.map((m: any) => ({
            ...m,
            source: file.replace('.json', ''),
          }))
        );
      }
    }

    // Fallback: return well-known defaults if no files found
    if (allModules.length === 0) {
      return res.status(200).json({
        modules: [
          {
            id: 'ai-systems',
            name: 'AI Systems',
            source: 'default',
            description: 'Large language models, agents, and RAG pipelines.',
            topics: [
              { id: 'prompt-engineering', name: 'Prompt Engineering', description: 'Designing effective prompts for LLMs.' },
              { id: 'rag',                name: 'RAG Optimization',   description: 'Retrieval-Augmented Generation techniques.' },
              { id: 'agents',             name: 'Agent Orchestration',description: 'Multi-agent system design.' },
            ],
          },
          {
            id: 'backend-engineering',
            name: 'Backend Engineering',
            source: 'default',
            description: 'Node.js, APIs, databases, and system design.',
            topics: [
              { id: 'node-js',       name: 'Node.js Fundamentals', description: 'Event loop, streams, async patterns.' },
              { id: 'databases',     name: 'Databases',            description: 'SQL, NoSQL, query optimization.' },
              { id: 'system-design', name: 'System Design',        description: 'Scalability, load balancing, caching.' },
            ],
          },
          {
            id: 'frontend-engineering',
            name: 'Frontend Engineering',
            source: 'default',
            description: 'React, performance, and modern web patterns.',
            topics: [
              { id: 'react',       name: 'React Patterns',     description: 'Hooks, state management, rendering.' },
              { id: 'performance', name: 'Web Performance',    description: 'Core Web Vitals and optimization.' },
              { id: 'typescript',  name: 'TypeScript',         description: 'Type system and advanced patterns.' },
            ],
          },
        ],
      });
    }

    return res.status(200).json({ modules: allModules });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/curriculum/:moduleId
 * Returns a single curriculum module by ID.
 */
router.get('/:moduleId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { moduleId } = req.params;

    let files: string[] = [];
    try {
      files = await fs.readdir(CURRICULUM_DIR);
    } catch {
      /* empty */
    }

    for (const file of files.filter(f => f.endsWith('.json'))) {
      const data = await readJsonFile(path.join(CURRICULUM_DIR, file));
      const found = data?.modules?.find((m: any) => m.id === moduleId);
      if (found) {
        return res.status(200).json({ module: found });
      }
    }

    return res.status(404).json({ error: 'Module not found', moduleId });
  } catch (error) {
    next(error);
  }
});

export default router;
