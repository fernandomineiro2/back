var winston = require('winston');
const MESSAGE = Symbol.for('message');

function Logger() { }

const myCustomLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        verbose: 'white',
        debug: 'blue'
    }
};

const jsonFormatter = (logEntry) => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry)
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
}

const dateFileName = formatDate(new Date());

const filename = 'logs/order-control-backend-midleware-' + dateFileName + '.log';

const maxFileSize = 5242880; //5MB


Logger.prototype.log = function (tipo, mensagem, logaconsole = false) {
    var consoleTransports;
    if (logaconsole) {
        consoleTransports = [
            new winston.transports.Console({ json: true }),
            new winston.transports.File({
                filename: filename,
                handleExceptions: true,
                json: true,
                maxsize: maxFileSize,
                maxFiles: 30,
                colorize: false
            })
        ]
    } else {
        consoleTransports = [
            new winston.transports.File({
                filename: filename,
                handleExceptions: true,
                json: true,
                maxsize: maxFileSize,
                maxFiles: 30,
                colorize: false
            })
        ]
    }
    winston.addColors(myCustomLevels.colors);

    var log = new winston.createLogger({
        level: tipo,
        levels: myCustomLevels.levels,
        format: winston.format.printf(info => `${new Date().toISOString()} ${info.message}`),
        // format: winston.format(jsonFormatter)(),
        timestamp: winston.format.timestamp,
        transports: consoleTransports
    });
    log.setMaxListeners(0);
    log.log(tipo, mensagem);
}

Logger.prototype.getInstance = function () {

    if (!Singleton.instance) {
        console.log('Logger Instance Created');
        Singleton.instance = new Logger();
    }

    return Singleton.instance;
}

Logger.prototype.destroy = function () {

    if (Singleton.instance) {
        console.log('Logger Instance Destroy');
        Singleton.instance = null;
    }
}

class Singleton {

    constructor() {
        if (!Singleton.instance) {

            Singleton.instance = new Logger();
        }
    }

    getInstance() {
        return Singleton.instance;
    }

}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = Logger;