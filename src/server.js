'use strict';

const express = require("express");
const http = require('http');

const appConfig = require('./config/app-config');

const Logger = require('./infra/logger');
const cors = require('cors');

class Server {

  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
    
  }

  appConfig() {
    new appConfig(this.app).includeConfig();
  }

  /* Including app Routes ends*/

  appExecute() {
    this.appConfig();

    //const port = process.env.PORT || 3000;
    // const host = process.env.HOST || `localhost`;
    this.app.use(cors);
    // var server = this.app.listen(port, () => {
    //   console.log(`Server Listening on: ${port}`);
      
    // });
    var server = this.app.listen(process.env.PORT || 3000, function () {
      var port = server.address().port;
      console.log("Express is working on port " + port);
    });

    // Add a connect listener
    
  }
}

const app = new Server();
app.appExecute();