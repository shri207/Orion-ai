import { IFeatureFlags } from './ConfigTypes';

export class FeatureFlagManager {
  constructor(private readonly flags: IFeatureFlags) {}

  public isEnabled(flagName: keyof IFeatureFlags): boolean {
    return !!this.flags[flagName];
  }

  public getAllFlags(): IFeatureFlags {
    return { ...this.flags };
  }
}
