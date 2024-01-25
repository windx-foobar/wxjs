import type { QueryInterface } from '@wxjs/sequelize/extra';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof import('@wxjs/sequelize/extra')) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },
      phone: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true
      },
      email: {
        type: Sequelize.DataTypes.STRING(255),
        unique: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      deleted_at: Sequelize.DataTypes.DATE
    });
    await queryInterface.createTable('certificates', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      number: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      deleted_at: Sequelize.DataTypes.DATE
    });
    await queryInterface.createTable('services', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      hash: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      deleted_at: Sequelize.DataTypes.DATE
    });
    await queryInterface.createTable('users_services', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      service_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'services'
          },
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      deleted_at: Sequelize.DataTypes.DATE
    });
    await queryInterface.addConstraint('users_services', {
      type: 'unique',
      fields: ['user_id', 'service_id'],
      name: 'users_services_AK_user_id_service_id'
    });
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },
      introtext: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      deleted_at: Sequelize.DataTypes.DATE
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint('users_services', 'users_services_AK_user_id_service_id');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('certificates');
    await queryInterface.dropTable('services');
    await queryInterface.dropTable('users_services');
    await queryInterface.dropTable('posts');
  }
};
