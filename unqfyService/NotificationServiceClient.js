const rp = require('request-promise');

class NotificationServiceClient {

    constructor(){

        //this._baseURL = 'http://' + '172.20.0.22' + ':' + '8090' + '/api';
        this._baseURL = 'http://' + 'localhost' + ':' + '8090' + '/api';
    }

    notificarDeAgregarArtista(artistaID){
        let options = {
            method: 'POST',
            uri: this._baseURL + '/artist?id=' + artistaID,
            json: true 
        };
        
        rp(options).catch( error => {
            console.log("hubo un error relacionado con el servicio de notificaciones, cuando se implemente el servicio de logging aparecera ahi");
        });
    }

    notificarDeEliminarArtista(artistaID){
        let options = {
            method: 'DELETE',
            uri: this._baseURL + '/artist?id=' + artistaID,
            json: true 
        };
        
        rp(options).catch( error => {
            console.log("hubo un error relacionado con el servicio de notificaciones, cuando se implemente el servicio de logging aparecera ahi");
        });
    }

    notificarDeNuevoAlbum(artistaID, nombreDelArtista, nombreDelAlbum){
        let sub = "Nuevo album para artista " + nombreDelArtista;
        let msg = "Se ha agregado el album " + nombreDelAlbum + " al artista " + nombreDelArtista;

        let options = {
            method: 'POST',
            uri: this._baseURL + '/notify',
            body: {
                artistID: artistaID,
                subject: sub,
                message: msg
            },
            json: true
        };
        
        rp(options).catch( error => {
            console.log("hubo un error relacionado con el servicio de notificaciones, cuando se implemente el servicio de logging aparecera ahi");
        })
    }
}

module.exports = NotificationServiceClient