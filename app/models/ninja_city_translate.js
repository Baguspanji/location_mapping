'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ninja_city_translate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ninja_city_translate.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'tier_code_1': {
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
  }, {
    sequelize,
    modelName: 'ninja_city_translate',
    tableName: 'ninja_city_translate',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return ninja_city_translate;
};