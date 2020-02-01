const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class EstadoModel extends Model { }

EstadoModel.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(75)
    },
    uf: {
        type: Sequelize.INTEGER(5)
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'estados'

});

module.exports = EstadoModel;