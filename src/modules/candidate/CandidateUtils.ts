import path from 'path';

export const resolveCandidatePath = (filename: string): string => {
  return path.resolve(process.cwd(), 'src/data/candidates', filename);
};
