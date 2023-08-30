'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shipper_provinces', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'name': {
        type: Sequelize.STRING
      },
      'latitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
      'longitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('shipper_cities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'province_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'shipper_provinces',
          key: 'id'
        }
      },
      'name': {
        type: Sequelize.STRING,
      },
      'type': {
        type: Sequelize.STRING,
        allowNull: true,
      },
      'latitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
      'longitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('shipper_districts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'city_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'shipper_cities',
          key: 'id'
        }
      },
      'name': {
        type: Sequelize.STRING,
      },
      'latitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
      'longitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('shipper_subdistricts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'district_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'shipper_districts',
          key: 'id'
        }
      },
      'name': {
        type: Sequelize.STRING,
      },
      'latitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
      'longitude': {
        type: Sequelize.STRING,
        allowNull: true,
      },
      'postcode': {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('shipper_subdistricts');
    await queryInterface.dropTable('shipper_districts');
    await queryInterface.dropTable('shipper_cities');
    await queryInterface.dropTable('shipper_provinces');
  }
};