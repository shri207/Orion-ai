import { Readable } from 'stream';

export const generatePdfStream = async (reportData: any): Promise<Readable> => {
  const stream = new Readable();
  stream.push('Mock PDF Generator Content');
  stream.push(null);
  return stream;
};
