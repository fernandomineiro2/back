const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class CategoriesModel extends Model { }

CategoriesModel.init({
    category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brand_id: {
        type: Sequelize.INTEGER
    },
    category_name: {
        type: Sequelize.STRING(150)
    },
    category_img: {
        type: Sequelize.STRING(150)
    },
    status: {
        type: Sequelize.TINYINT
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'categories'
});

module.exports = CategoriesModel;