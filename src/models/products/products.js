const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ProductsModel extends Model { }

ProductsModel.init({
  product_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_name: {
    type: Sequelize.STRING(200)
  },
  product_description: {
    type: Sequelize.STRING(255)
  },
  brand_id: {
    type: Sequelize.INTEGER(11),
  },
  category_id: {
    type: Sequelize.INTEGER(11),
  },
  product_path_img: {
    type: Sequelize.STRING(200)
  },
  product_qtd: {
    type: Sequelize.INTEGER(11)
  },
  date_create: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  status: {
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  product_saller: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  product_best_sellers: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: Sequelize.DOUBLE
  },
  sales_price: {
    type: Sequelize.DOUBLE
  },
  associate_price:{
    type: Sequelize.DOUBLE
  },
  description:{
    type: Sequelize.TEXT
  }

}, {
  sequelize: pool,
  timestamps: false,
  modelName: 'products'
});

module.exports = ProductsModel;
