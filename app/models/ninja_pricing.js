'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ninja_pricing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ninja_pricing.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    'tier_code_1': {
      type: DataTypes.STRING,
    },
    'tier_code_2': {
      type: DataTypes.STRING,
    },
    'price': {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    'estimate': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'type': {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ninja_pricing',
    tableName: 'ninja_pricing',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return ninja_pricing;
};