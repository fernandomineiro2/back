const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class PaymentBillsModel extends Model { }

PaymentBillsModel.init({
    payment_bills_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_group_id: {
        type: Sequelize.INTEGER,
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    payment_total_value: {
        type: Sequelize.FLOAT,
    },
    payment_installment_value: {
        type: Sequelize.FLOAT,
    },
    installment_qtd: {
        type: Sequelize.INTEGER,
    },
    installment_nth: {
        type: Sequelize.TINYINT,
    },
    date_create: {
        type: Sequelize.DATEONLY,
    },
    date_payment: {
        type: Sequelize.DATEONLY,
    },
    type: {
        type: Sequelize.TINYINT(2),
    },
    status_payment: {
        type: Sequelize.TINYINT,
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'payment_bills'
});

module.exports = PaymentBillsModel;