/*
* Author: @micajeho
*/

const expressConfig = require('./express-config');
const bodyParser = require('body-parser');
const cors = require('cors');

class AppConfig{
	
	constructor(app){
		this.app = app;
	}

	includeConfig() {
		this.app.use(
            bodyParser.json()
        );
        this.app.use(
        	cors()
        );        
		new expressConfig(this.app);
	}

}
module.exports = AppConfig;
