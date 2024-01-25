declare module '@windx-foobar/sequelize' {
  import type { Model } from 'sequelize';

  export interface ModelsMap {
    Base: typeof Model;
  }
}

export {};
