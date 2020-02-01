const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class UsersModel extends Model { }

UsersModel.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    seller_id: {
        type: Sequelize.TINYINT
    },
    name: {
        type: Sequelize.STRING(100)
    },
    email: {
        type: Sequelize.STRING(255)
    },
    phone_number: {
        type: Sequelize.STRING(100)
    },
    profile: {
        type: Sequelize.TINYINT
    },
    associate: {
        type: Sequelize.TINYINT
    },
    avatar: {
        type: Sequelize.STRING(255)
    },
    qty_of_purchases: {
        type: Sequelize.STRING(255)
    },
    password: {
        type: Sequelize.STRING(255)
    },
    date_create: {
        type: Sequelize.DATE
    },
    last_acess: {
        type: Sequelize.DATE
    },
    status: {
        type: Sequelize.TINYINT
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'users'
});

module.exports = UsersModel;
