var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');

class LogglyCLient {

    constructor(){
        winston.add(new Loggly({
            token: "506a9833-478f-49a3-814b-6db6d3fbd0ca",
            subdomain: "UNQfy1",
            tags: ["Winston-NodeJS"],
            json: true
        }));
    }

    loggearInfoLogRemotamente(unLog){

        winston.log('info', unLog);
    }

    loggearErrorLogRemotamente(unLog){

        winston.error(unLog);
    }
    
    loggearWarningLogRemotamente(unLog){

        winston.warn(unLog);
    }
}

module.exports = LogglyCLient;