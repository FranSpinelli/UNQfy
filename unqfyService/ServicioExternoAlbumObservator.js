const UNQfyObservator = require('./UNQfyObservator');

class ServicioExternoAlbumObservator extends UNQfyObservator{

    constructor(clienteDeServicioExterno){
        super(clienteDeServicioExterno);
    }

    updatear(string, objetoJSON){
        
        if(string === "AgregadoDeAlbum"){
            this._cliente.notificarDeNuevoAlbum(objetoJSON.artistaID, objetoJSON.nombreDeArtista, objetoJSON.nombreDeAlbum);
        }
    }
}

module.exports = ServicioExternoAlbumObservator;