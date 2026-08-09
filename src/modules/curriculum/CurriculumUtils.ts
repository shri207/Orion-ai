import path from 'path';

export const resolveCurriculumPath = (filename: string): string => {
  // Resolves paths relative to the project root
  return path.resolve(process.cwd(), 'src/data/curriculum', filename);
};
