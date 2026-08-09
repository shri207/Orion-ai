import { IJsonRepair } from './ResponseParserInterfaces';

export class JsonRepair implements IJsonRepair {
  public repair(brokenJson: string): string {
    let repaired = brokenJson;
    
    repaired = repaired.replace(/,\s*([\}\]])/g, '$1');
    
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      repaired += '}'.repeat(openBraces - closeBraces);
    }
    
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;
    if (openBrackets > closeBrackets) {
      repaired += ']'.repeat(openBrackets - closeBrackets);
    }

    return repaired;
  }
}
