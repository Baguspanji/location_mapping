'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class geo_province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  geo_province.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'name': {
      type: DataTypes.STRING
    },
    'lat': {
      type: DataTypes.FLOAT
    },
    'long': {
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'geo_province',
    tableName: 'geo_provinces',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
    deletedAt: 'deleted_on',
  });
  return geo_province;
};