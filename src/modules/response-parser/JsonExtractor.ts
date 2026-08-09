import { IJsonExtractor } from './ResponseParserInterfaces';

export class JsonExtractor implements IJsonExtractor {
  public extract(rawText: string): string[] {
    if (!rawText) return [];
    
    const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
    const matches: string[] = [];
    let match;
    
    while ((match = markdownRegex.exec(rawText)) !== null) {
      if (match[1]) matches.push(match[1].trim());
    }
    
    if (matches.length > 0) return matches;

    const bracketRegex = /(\{.*\}|\[.*\])/s;
    const bracketMatch = rawText.match(bracketRegex);
    
    if (bracketMatch && bracketMatch[1]) {
      return [bracketMatch[1].trim()];
    }

    return [rawText.trim()];
  }
}
