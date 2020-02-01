const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class OrdersModel extends Model { }

OrdersModel.init({
    order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_group_id: {
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    brand_id: {
        type: Sequelize.INTEGER
    },
    category_id: {
        type: Sequelize.INTEGER
    },
    product_id: {
        type: Sequelize.INTEGER
    },
    seller_id: {
        type: Sequelize.TINYINT
    },
    qtd: {
        type: Sequelize.INTEGER
    },
    unit_price: {
        type: Sequelize.DOUBLE
    },
    total_price: {
        type: Sequelize.DOUBLE
    },
    associate_price: {
        type: Sequelize.DOUBLE
    },
    datecreate: {
        type: Sequelize.DATEONLY
    },
    delivery: {
        type: Sequelize.TINYINT
    },
    date_delivered: {
        type: Sequelize.DATEONLY
    },
    status: {
        type: Sequelize.TINYINT
    },
    obs: {
        type: Sequelize.STRING(200)
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'orders'
});

module.exports = OrdersModel;