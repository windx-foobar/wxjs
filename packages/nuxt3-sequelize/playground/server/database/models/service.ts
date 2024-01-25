import { isNullOrUndefined } from '@windx-foobar/shared';
import type { User } from './user';
import { defineModel } from '#wxjs/sequelize';
import {
  Model,
  Utils,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type FindOptions,
  type Attributes,
  type ModelStatic
} from '#wxjs/sequelize/extra';

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare hash: string;

  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;

  declare users?: NonAttribute<User[]>;

  static findByHash(this: ModelStatic<Service>, hash: Service['hash'], options: Omit<FindOptions<Attributes<Service>>, 'where'>): Promise<this | null>;
}

export default defineModel((sequelize, dataTypes) => {
  Service.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: {
          name: 'name',
          msg: 'Наименование сервиса уже занято'
        }
      },
      hash: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: {
          name: 'hash',
          msg: 'Hash должен быть уникальным'
        }
      },
      createdAt: dataTypes.DATE,
      updatedAt: dataTypes.DATE
    },
    { tableName: 'services', underscored: true, sequelize }
  );

  Service.findByHash = async function(hash, options) {
    if (isNullOrUndefined(hash)) {
      return null;
    }

    options = Utils.cloneDeep(options) || {};
    options.where = { hash };

    return await this.findOne(options);
  };

  return {
    association({ User }) {
      Service.belongsToMany(User, { as: 'users', through: 'users_services' });
    }
  };
});
