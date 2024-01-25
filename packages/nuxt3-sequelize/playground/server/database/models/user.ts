import type { Certificate } from './certificate';
import type { Service } from './service';
import type { Post } from './post';
import { defineModel } from '#wxjs/sequelize';
import {
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type HasManySetAssociationsMixin,
  type HasManyCreateAssociationMixin
} from '#wxjs/sequelize/extra';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone: CreationOptional<string> | null;

  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;

  declare certificate?: NonAttribute<Certificate>;
  declare services?: NonAttribute<Service[]>;
  declare setServices: HasManySetAssociationsMixin<Service, number>;
  declare posts?: NonAttribute<Post[]>;
  declare createPost: HasManyCreateAssociationMixin<Post>;
}

export default defineModel((sequelize, dataTypes) => {
  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: {
          name: 'email',
          msg: 'E-mail уже используется'
        },
        validate: {
          isEmail: {
            msg: 'Поле должно быть e-mail'
          }
        }
      },
      phone: {
        type: dataTypes.STRING(255),
        allowNull: true
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false
      },
      createdAt: dataTypes.DATE,
      updatedAt: dataTypes.DATE
    },
    { tableName: 'users', underscored: true, sequelize }
  );

  return {
    association({ Certificate, Service, Post }) {
      User.hasOne(Certificate, { as: 'certificate', foreignKey: 'userId' });
      User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
      User.belongsToMany(Service, { through: 'users_services', as: 'services' });
    }
  };
});
