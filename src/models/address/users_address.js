const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class UsersAddressModel extends Model { }

UsersAddressModel.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    rua: {
        type: Sequelize.STRING(120)
    },
    numero: {
        type: Sequelize.INTEGER(5)
    },
    bairro: {
        type: Sequelize.STRING(150)
    },
    cidade: {
        type: Sequelize.STRING(120)
    },
    estado: {
        type: Sequelize.STRING(75)
    },
    cidade_id: {
        type: Sequelize.INTEGER
    },
    estado_id: {
        type: Sequelize.INTEGER
    },
    cep: {
        type: Sequelize.INTEGER
    },
    latitude: {
        type: Sequelize.STRING(120)
    },
    longitude: {
        type: Sequelize.STRING(120)
    },
    status: {
        type: Sequelize.TINYINT
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'address_users'

});

module.exports = UsersAddressModel;
