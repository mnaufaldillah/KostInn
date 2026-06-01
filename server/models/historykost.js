'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoryKost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HistoryKost.belongsTo(models.Profile, {
        foreignKey: 'ProfileId'
      });
      HistoryKost.belongsTo(models.RoomKost, {
        foreignKey: 'RoomKostId'
      });
    }
  }
  HistoryKost.init({
    ProfileId: DataTypes.INTEGER,
    RoomKostId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HistoryKost',
  });
  return HistoryKost;
};