'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saruman_province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  saruman_province.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'shipper_id': {
      type: DataTypes.INTEGER
    },
    'name': {
      type: DataTypes.STRING
    },
    'latitude': {
      type: DataTypes.STRING
    },
    'longitude': {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'saruman_province',
    tableName: 'saruman_province',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return saruman_province;
};