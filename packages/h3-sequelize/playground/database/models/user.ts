import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from '@wxjs/sequelize/extra';
import { defineModel } from '../../../src';

declare module '@wxjs/sequelize' {
  interface ModelsMap {
    User: typeof User;
  }
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
}

export default defineModel((sequelize, dataTypes) => {
  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false
      }
    },
    { tableName: 'users', underscored: true, sequelize }
  );
});
