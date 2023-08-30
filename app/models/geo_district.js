'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class geo_district extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.geo_district.belongsTo(models.geo_city, {
        foreignKey: 'city_id',
      })
    }
  };
  geo_district.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'city_id': {
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
    modelName: 'geo_district',
    tableName: 'geo_districts',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
    deletedAt: 'deleted_on',
  });
  return geo_district;
};