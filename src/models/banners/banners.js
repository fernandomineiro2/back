const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class BannerModel extends Model { }

BannerModel.init({
    banner_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    banner_title: {
        type: Sequelize.STRING(100)
    },
    banner_path_img: {
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
    modelName: 'banners'

});

module.exports = BannerModel;