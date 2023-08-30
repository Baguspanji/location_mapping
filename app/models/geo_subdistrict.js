'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class geo_subdistrict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.geo_subdistrict.belongsTo(models.geo_district, {
        foreignKey: 'district_id',
      })
    }
  };
  geo_subdistrict.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'district_id': {
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
    modelName: 'geo_subdistrict',
    tableName: 'geo_villages',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
    deletedAt: 'deleted_on',
  });
  return geo_subdistrict;
};