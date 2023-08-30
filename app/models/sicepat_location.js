'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sicepat_location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  sicepat_location.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'code': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'province_name': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'city_name': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'district_name': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'has_mapping': {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'sicepat_location',
    tableName: 'sicepat_location',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return sicepat_location;
};