const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class SellerModel extends Model { }

SellerModel.init({
    seller_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seller_name: {
        type: Sequelize.STRING(110)
    },
    seller_email: {
        type: Sequelize.STRING(50)
    },
    seller_img: {
        type: Sequelize.STRING(100)
    },
    status: {
        type: Sequelize.TINYINT(1),
    },
    date_create: {
        type: Sequelize.DATEONLY
    },
    commission_percentage: {
        type: Sequelize.INTEGER
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'sellers'

});

module.exports = SellerModel;