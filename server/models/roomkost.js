'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomKost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoomKost.hasMany(models.HistoryKost, {
        foreignKey: 'RoomKostId'
      });
    }
  }
  RoomKost.init({
    roomNum: DataTypes.INTEGER,
    roomPrice: DataTypes.STRING,
    status: DataTypes.STRING,
    roomFacilities: DataTypes.STRING,
    roomPhotoUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RoomKost',
  });
  return RoomKost;
};