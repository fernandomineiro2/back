const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class RegionModel extends Model { }

RegionModel.init({
    region_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seller_id: {
        type: Sequelize.INTEGER
    },
    region_city_id: {
        type: Sequelize.INTEGER
    },
    region_state_id: {
        type: Sequelize.INTEGER
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'regions'

});

module.exports = RegionModel;