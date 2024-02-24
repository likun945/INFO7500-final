import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    field: 'username'
  },
  accountCreated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'account_created'
  },
  accountUpdated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'account_updated'
  }
}, {
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      user.accountUpdated = new Date();
    }
  },
  tableName: 'users'
});

export default User;
