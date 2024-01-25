import type { User } from './user';
import {
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute
} from '@windx-foobar/sequelize/extra';
import { defineModel } from '../../../src';

declare module '@windx-foobar/sequelize' {
  interface ModelsMap {
    Post: typeof Post;
  }
}

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id?: CreationOptional<number>;
  declare title: string;
  declare introtext?: CreationOptional<string>;

  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;

  declare author?: NonAttribute<User>;
}

export default defineModel((sequelize, dataTypes) => {
  Post.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: dataTypes.STRING(255),
        allowNull: false
      },
      introtext: {
        type: dataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      createdAt: dataTypes.DATE,
      updatedAt: dataTypes.DATE
    },
    {
      tableName: 'posts',
      underscored: true,
      sequelize,
      defaultScope: {
        attributes: { exclude: ['userId'] }
      }
    }
  );

  return {
    association({ User }) {
      Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });
    }
  };
});
