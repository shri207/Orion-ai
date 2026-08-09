import { ISchemaValidator } from './ResponseParserInterfaces';
import { IValidationSchema } from './ResponseParserTypes';

export class SchemaValidator implements ISchemaValidator {
  public validate(data: any, schema: IValidationSchema): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data) {
      return { isValid: false, errors: ['Data is empty or null'] };
    }

    if (schema.type === 'object' && typeof data !== 'object') {
      errors.push('Expected object type');
      return { isValid: false, errors };
    }

    if (schema.type === 'array' && !Array.isArray(data)) {
      errors.push('Expected array type');
      return { isValid: false, errors };
    }

    if (schema.required && typeof data === 'object') {
      for (const req of schema.required) {
        if (data[req] === undefined) {
          errors.push(`Missing required field: ${req}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
