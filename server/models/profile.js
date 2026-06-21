'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: 'UserId'
      });
      Profile.hasMany(models.HistoryKost, {
        foreignKey: 'ProfileId'
      });
    }
  }
  Profile.init({
    UserId: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    contactPhone: DataTypes.STRING,
    address: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pencari Kost',
      validate: {
        isIn: {
          args: [['Pencari Kost', 'Penyewa Kost', 'Admin']],
          msg: 'Role must be Pencari Kost, Penyewa Kost, or Admin'
        }
      }
    },
    isVerified: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'active', 'occupied', 'inactive']],
          msg: 'Status must be pending, active, occupied, or inactive'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};