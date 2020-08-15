const fs = require('fs');

class LoggingService{
    
    constructor(){
        this._recorderFile = 'logs.txt'
    }

    loggearSucesoLocalmente(unLog){

        return new Promise((resolve,reject) => {
            fs.appendFile(this._recorderFile, unLog, (err) => { if(err){reject(err)}else{resolve()} });
        });
    }
}

module.exports = LoggingService;