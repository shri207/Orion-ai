export class EnvironmentLoader {
  public load(): void {}

  public get(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value !== undefined) {
      return value;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return '';
  }

  public getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value !== undefined) {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return defaultValue;
  }

  public getBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value !== undefined) {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return defaultValue;
  }
}
