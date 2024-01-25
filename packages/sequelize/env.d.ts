declare module '@wxjs/sequelize' {
  import type { Model } from 'sequelize';

  export interface ModelsMap {
    Base: typeof Model;
  }
}

export {};
