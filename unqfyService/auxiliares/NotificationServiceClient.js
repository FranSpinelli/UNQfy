const rp = require('request-promise');

class NotificationServiceClient{

    notificarDeAgregarArtista(artistaID){
        let options = {
            method: 'POST',
            uri: 'http://localhost:8090/api/artist?id=' + artistaID,
            json: true 
        };
         
        rp(options);
    }

    notificarDeEliminarArtista(artistaID){
        let options = {
            method: 'DELETE',
            uri: 'http://localhost:8090/api/artist?id=' + artistaID,
            json: true 
        };
         
        rp(options);
    }

    notificarDeNuevoAlbum(artistaID, nombreDelArtista, nombreDelAlbum){
        let sub = "Nuevo album para artista " + nombreDelArtista;
        let msg = "Se ha agregado el album " + nombreDelAlbum + " al artista " + nombreDelArtista;

        let options = {
            method: 'POST',
            uri: 'http://localhost:8090/api/notify',
            body: {
                artistID: artistaID,
                subject: sub,
                message: msg
            },
            json: true
        };
         
        rp(options)
    }
}

module.exports = NotificationServiceClient
