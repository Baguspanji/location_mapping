'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rajaongkir_provinces', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'name': {
        type: Sequelize.STRING
      },
    });

    await queryInterface.createTable('rajaongkir_cities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'province_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'rajaongkir_provinces',
          key: 'id'
        }
      },
      'name': {
        type: Sequelize.STRING,
      },
      'type': {
        type: Sequelize.STRING,
      },
      'postal_code': {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('rajaongkir_subdistricts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'city_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'rajaongkir_cities',
          key: 'id'
        }
      },
      'name': {
        type: Sequelize.STRING,
      },
      'postal_code': {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rajaongkir_subdistricts');
    await queryInterface.dropTable('rajaongkir_cities');
    await queryInterface.dropTable('rajaongkir_provinces');
  }
};