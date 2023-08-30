'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class geo_city extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.geo_city.belongsTo(models.geo_province, {
        foreignKey: 'province_id',
      })
    }
  };
  geo_city.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'province_id': {
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
    modelName: 'geo_city',
    tableName: 'geo_cities',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
    deletedAt: 'deleted_on',
  });
  return geo_city;
};