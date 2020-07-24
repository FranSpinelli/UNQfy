const NotificationServiceClient = require('./NotificationServiceClient');

class ManejadorDeObservadores{

    constructor(){
        this._observadores = []
    }

    agregarObservador(nuevoObservador){
        this._observadores.push(nuevoObservador);
    }

    notificarNuevoAlbum(artistaID, nombreArtista, nombreAlbum){

        this._observadores.forEach(observador => {
            if(observador.interesadoEnNuevosAlbums){
                observador.notificarDeNuevoAlbum(artistaID, nombreArtista, nombreAlbum);
            }
        })
    }

    notificarNuevoArtista(artistaID){

        this._observadores.forEach(observador => {
            if(observador.interesadoEnCambiosEnArtistas){
                observador.notificarDeAgregarArtista(artistaID);
            }
        })
    }

    notificarEliminadoDeArtista(artistaID){

        this._observadores.forEach(observador => {
            if(observador.interesadoEnCambiosEnArtistas){
                observador.notificarDeEliminarArtista(artistaID);
            }
        })
    }
}

module.exports = ManejadorDeObservadores