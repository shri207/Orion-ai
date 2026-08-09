import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'json', 'text-summary'],
      thresholds: {
        statements: 50,
        functions: 50,
        branches: 40,
        lines: 50
      },
      exclude: [
        'src/main.ts',
        'src/index.ts',
        'src/server.ts',
        'src/config/**',
        'src/types/**',
        'src/**/types/**',
        'src/**/schemas/**',
        'src/**/index.ts',
        'prisma/**',
        'tests/**',
        'node_modules/**'
      ]
    },
    // We will set up global setup for Testcontainers only when running tests that need it, 
    // or we can handle it at the suite level. But a global setup is requested:
    // globalSetup: './tests/helpers/globalSetup.ts'
  }
});
