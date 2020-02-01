const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class BrandsModel extends Model { }

BrandsModel.init({
    brand_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brand_name: {
        type: Sequelize.STRING(150)
    },
    brand_contact_name: {
        type: Sequelize.STRING(150)
    },
    brand_contact_phone_number: {
        type: Sequelize.STRING(150)
    },
    brand_address_one: {
        type: Sequelize.STRING(100)
    },
    brand_address_two: {
        type: Sequelize.STRING(100)
    },
    brand_path_image: {
        type: Sequelize.STRING(150)
    },
    status: {
        type: Sequelize.TINYINT
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'brands'
});

module.exports = BrandsModel;