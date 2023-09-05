'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ninja_location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ninja_location.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'postal_code': {
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
    modelName: 'ninja_location',
    tableName: 'ninja_location',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return ninja_location;
};