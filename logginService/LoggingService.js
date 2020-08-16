const fs = require('fs');

class LoggingService{
    
    constructor(){
        this._recorderFile = 'logs.txt'
    }

    loggearSucesoLocalmente(unLog){
        let today = new Date();
        let date = today.getDate() + '/' +  (today.getMonth()+1) + '/' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let valorALoggear = '[' + date + ':' + time + '] ';

        return new Promise((resolve,reject) => {
            fs.appendFile(this._recorderFile, valorALoggear + unLog, (err) => { if(err){reject(err)}else{resolve()} });
        });
    }
}

module.exports = LoggingService;