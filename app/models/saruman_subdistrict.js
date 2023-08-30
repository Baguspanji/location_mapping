'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saruman_subdistrict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.saruman_subdistrict.belongsTo(models.saruman_district, {
        foreignKey: 'district_id',
      })
    }
  };
  saruman_subdistrict.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    'district_id': {
      type: DataTypes.INTEGER
    },
    'shipper_id': {
      type: DataTypes.INTEGER
    },
    'name': {
      type: DataTypes.STRING
    },
    'latitude': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'longitude': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'postal_code': {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'saruman_subdistrict',
    tableName: 'saruman_subdistrict',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  });
  return saruman_subdistrict;
};