const UNQfyObservator = require('./UNQfyObservator');

class SucesosEnUNQfyObservator extends UNQfyObservator{

    constructor(clienteDeServicioExterno){
        super(clienteDeServicioExterno);
    }

    updatear(string, objetoJSON){
        
        if(string === "AgregadoDeArtista" || string === "AgregadoDeAlbum" || string === "AgregadoDeTrack"){
            this._cliente.loggearAgregado(objetoJSON.loggMessage);
        }else if(string === "EliminadoDeArtista" || string === "EliminadoDeAlbum" || string === "EliminadoDeTrack"){
            this._cliente.loggearEliminado(objetoJSON.loggMessage);
        }else if(string === "ErrorDeModelo"){
            this._cliente.loggearError(objetoJSON.loggMessage);
        }
    }
}

module.exports = SucesosEnUNQfyObservator;