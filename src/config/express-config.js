/*
Configuracao do express
*/
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('../routes');
const path = require('path');
const engine = require('ejs-locals')
const express = require('express');
const Logger = require('../infra/logger');

class ExpressConfig {

	constructor(app) {
		const logger = new Logger();

		// INSERT LOGGER FOR ALL REQUEST, DO NOT CHANGE THIS
		app.use(function (req, res, next) {
			// Put some preprocessing here.
			res.logger = logger;
			next();
		});
		// Setting .html as the default template extension
		app.set('view engine', 'html');
		

		// //Files 
		// app.use(require('express').static(require('path').join('../public')));
		app.use(express.static(__dirname + '../../public'));

		// demais configuracoes do express
		app.logger = logger;

		const corsOptions = {
			exposedHeaders: ['x-access-token']
		};
		// deve liberar o CORS senão
		app.options('*', cors()) // include before other routes
		app.use(cors(corsOptions));
		app.use(bodyParser.json());

		//definicao da engine
		app.engine('ejs', engine);

		app.use('/apiV1/', router);
		const port = process.env.PORT || 3000;

		/* GET home page. */
		app.engine('ejs', engine);
		app.set('views', path.join(__dirname, '../views'));
		app.engine('ejs', engine);

		app.set('view engine', 'ejs');

		app.get('/', function (req, res) {
			res.render('index.ejs', { title: 'OrderControl - Web API', port });
		});

		app.get('/home', function (req, res) {
			res.render('index.ejs', { title: 'OrderControl - Web API', port });
		});

		app.get('/docs', function (req, res) {
			res.render('docs.ejs', { title: 'OrderControl - Web API', port });
		});
	}
}
module.exports = ExpressConfig;
