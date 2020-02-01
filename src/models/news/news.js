const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class NewModel extends Model { }

NewModel.init({
    new_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    new_title: {
        type: Sequelize.STRING(100)
    },
    new_text: {
        type: Sequelize.TEXT
    },
    new_path_img: {
        type: Sequelize.STRING(100)
    },    
    status: {
        type: Sequelize.TINYINT(1),
    },
    date_create: {
        type: Sequelize.DATEONLY
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'news'

});

module.exports = NewModel;