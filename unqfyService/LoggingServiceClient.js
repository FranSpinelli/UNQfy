const rp = require('request-promise');

class LoggingServiceClient {

    constructor(){

        this._baseURL = 'http://' + 'localhost' + ':' + '9000' + '/api';
    }
    
    loggearAgregado(unLogg){
        let options = {
            method: 'POST',
            uri: this._baseURL + '/logg/addition',
            json: true ,
            body: {
                message: unLogg
            }
        };
        
        rp(options).catch( error => {
            console.log("hubo un error relacionado con el servicio de logging, cuando se implemente el servicio de notificaciones aparecera ahi");
        });
    }

    loggearEliminado(unLogg){
        let options = {
            method: 'POST',
            uri: this._baseURL + '/logg/removal',
            json: true ,
            body: {
                message: unLogg
            }
        };
        
        rp(options).catch( error => {
            console.log("hubo un error relacionado con el servicio de logging, cuando se implemente el servicio de notificaciones aparecera ahi");
        });
    }

    loggearError(unLogg){
        let options = {
            method: 'POST',
            uri: this._baseURL + '/logg/error',
            json: true ,
            body: {
                message: unLogg
            }
        };
        
        rp(options).catch( error => {
            console.log("hubo un error relacionado con el servicio de logging, cuando se implemente el servicio de notificaciones aparecera ahi");
        });
    }
}


module.exports = LoggingServiceClient