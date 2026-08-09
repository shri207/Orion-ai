import { IPromptTemplateEngine } from './PromptBuilderInterfaces';
import { IPromptTemplateData } from './PromptBuilderTypes';

export class PromptTemplateEngine implements IPromptTemplateEngine {
  public render(template: string, data: IPromptTemplateData): string {
    return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
      const keys = key.split('.');
      let value: any = data;
      for (const k of keys) {
        if (value === undefined || value === null) break;
        value = value[k];
      }
      return value !== undefined && value !== null ? String(value) : '';
    });
  }
}
