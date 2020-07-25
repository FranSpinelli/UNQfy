const rp = require('request-promise');

class UNQfyClient {

    constructor(){
        //this._baseURL = 'http://' + '172.20.0.22' + ':' + '8090' + '/api';
        this._baseURL = 'http://' + 'localhost' + ':' + '8080' + '/api';
    }
    
    getArtistaConID(artistaID){
        var options = {
            uri: this._baseURL + '/artists/' + artistaID,
            json: true // Automatically parses the JSON string in the response
        };
         
        return rp(options);
    }
}

module.exports = UNQfyClient;