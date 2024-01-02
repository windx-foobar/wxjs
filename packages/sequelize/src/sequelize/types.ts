import type { Options, Dialect, Sequelize, DataTypes, Model } from 'sequelize';

interface ExtendedOptions {
  verbose?: boolean;
  logging?: boolean | ((message: string) => any);
}

type OptionsWithStorageRequired = {
  dialect: 'sqlite';
  storage: Required<Options['storage']>;
} & Omit<Options, 'storage' | 'dialect'> & ExtendedOptions;

type OptionsWithHostPortRequired = {
  dialect: Exclude<Dialect, 'sqlite'>;
  host: Required<Options['host']>;
  port: Required<Options['port']>;
} & Omit<Options, 'storage' | 'host' | 'port' | 'dialect'> & ExtendedOptions;

export type ConnectionOptions = OptionsWithHostPortRequired | OptionsWithStorageRequired;

export interface ModelsMap {
  Base: typeof Model;
}

export interface ModelDefinition {
  __model_def__?: true;

  (sequelize: Sequelize, dataTypes: typeof DataTypes):
    | Promise<ModelDefinitionResult | void>
    | ModelDefinitionResult
    | void;
}

export interface ModelDefinitionResult {
  association?(models: Omit<ModelsMap, 'Base'>): void | Promise<void>;
}
