const NotificationServiceClient = require('./NotificationServiceClient');

class ManejadorDeObservadores{

    constructor(){
        this._observadores = []
    }

    agregarObservador(nuevoObservador){
        this._observadores.push(nuevoObservador);
    }

    notificarNuevoAlbum(artistaID, nombreArtista, nombreAlbum){
        let listaDePromesas = [];
        this._observadores.forEach(observador => {
            if(observador instanceof NotificationServiceClient){
                listaDePromesas.push(observador.notificarDeNuevoAlbum(artistaID, nombreArtista, nombreAlbum));
            }
        })

        return Promise.all(listaDePromesas); 
    }

    notificarNuevoArtista(artistaID){
        let listaDePromesas = [];
        this._observadores.forEach(observador => {
            if(observador instanceof NotificationServiceClient){
                listaDePromesas.push(observador.notificarDeAgregarArtista(artistaID));
            }
        })
        return Promise.all(listaDePromesas); 
    }

    notificarEliminadoDeArtista(artistaID){
        let listaDePromesas = [];
        this._observadores.forEach(observador => {
            if(observador instanceof NotificationServiceClient){
                listaDePromesas.push(observador.notificarDeEliminarArtista(artistaID));
            }
        })
        return Promise.all(listaDePromesas);
    }
}

module.exports = ManejadorDeObservadores