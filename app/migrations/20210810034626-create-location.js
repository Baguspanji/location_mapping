'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('provinces', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'shipper_id': {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    await queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'province_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'provinces',
          key: 'id'
        }
      },
      'shipper_id': {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      'name': {
        type: Sequelize.STRING,
      },
      'postal_code': {
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

    await queryInterface.createTable('districts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'city_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'cities',
          key: 'id'
        }
      },
      'shipper_id': {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      'name': {
        type: Sequelize.STRING,
      },
      'postal_code': {
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

    await queryInterface.createTable('subdistricts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'district_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'districts',
          key: 'id'
        }
      },
      'shipper_id': {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('subdistricts');
    await queryInterface.dropTable('districts');
    await queryInterface.dropTable('cities');
    await queryInterface.dropTable('provinces');
  }
};