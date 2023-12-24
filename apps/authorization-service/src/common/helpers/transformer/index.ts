import { ValueTransformer } from 'typeorm';

export const bigIntTransformer: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => parseInt(databaseValue),
};
