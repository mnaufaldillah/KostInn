'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { 
        foreignKey: 'UserId' 
      });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email format!'
        },
        notNull: {
          args: true,
          msg: 'Email cannot be empty!'
        },
        notEmpty: {
          args: true,
          msg: 'Email cannot be empty!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Password is required!'
        },
        notEmpty: {
          args: true,
          msg: 'Password cannot be empty!'
        }
      }
    },
    IDCardUrl: {
      type: DataTypes.STRING
    },
    otpCode: {
      type: DataTypes.STRING
    },
    otpExpires: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance) => {
    instance.IDCardUrl = '';
  });

  // ponytail: hash on create AND change; beforeCreate used to hash too → double-hashed passwords (login failed)
  User.beforeSave((instance) => {
    if (instance.changed('password')) {
      instance.password = hashPassword(instance.password);
    }
  });
  return User;
};