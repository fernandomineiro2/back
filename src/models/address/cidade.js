const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class CidadeModel extends Model { }

CidadeModel.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(120)
    },
    estado: {
        type: Sequelize.INTEGER(5)
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'cidades'

});

module.exports = CidadeModel;