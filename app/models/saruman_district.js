'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saruman_district extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.saruman_district.belongsTo(models.saruman_city, {
            foreignKey: 'city_id',
        })
    }
  };
  saruman_district.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'city_id': {
      type: DataTypes.INTEGER
    },
    'shipper_id': {
      type: DataTypes.INTEGER
    },
    'sicepat_id': {
      type: DataTypes.INTEGER
    },
    'name': {
      type: DataTypes.STRING
    },
    'postal_code': {
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
    modelName: 'saruman_district',
    tableName: 'saruman_district',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return saruman_district;
};