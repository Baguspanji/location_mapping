'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saruman_city extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.saruman_city.belongsTo(models.saruman_province, {
            foreignKey: 'province_id',
        })
    }
  };
  saruman_city.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'province_id': {
      type: DataTypes.INTEGER
    },
    'shipper_id': {
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
    modelName: 'saruman_city',
    tableName: 'saruman_city',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return saruman_city;
};