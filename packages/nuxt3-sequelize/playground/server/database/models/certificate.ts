import type { User } from './user';
import { defineModel } from '#wxjs/sequelize';
import {
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type ForeignKey,
  type NonAttribute,
  type HasOneCreateAssociationMixin
} from '#wxjs/sequelize/extra';

export class Certificate extends Model<InferAttributes<Certificate>, InferCreationAttributes<Certificate>> {
  declare id?: CreationOptional<number>;
  declare number: string;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;

  declare userId?: ForeignKey<User['id']>;
  declare user?: NonAttribute<User>;
  declare createUser: HasOneCreateAssociationMixin<User>;
}

export default defineModel((sequelize, dataTypes) => {
  Certificate.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      number: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: {
          name: 'number',
          msg: 'Сертификат уже используется'
        },
        validate: {
          notEmpty: {
            msg: 'Поле обязательно для заполнения'
          }
        }
      },
      createdAt: dataTypes.DATE,
      updatedAt: dataTypes.DATE
    },
    {
      tableName: 'certificates',
      underscored: true,
      sequelize
    }
  );

  return {
    association({ User }) {
      Certificate.belongsTo(User, { as: 'user' });
    }
  };
});
