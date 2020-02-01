// const config = require('./index');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let pool;
if (config.use_env_variable) {
    pool = sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    pool = sequelize = new Sequelize(config.database, config.username, config.password, config);
}

module.exports = pool;
