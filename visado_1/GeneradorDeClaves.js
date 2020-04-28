class GeneradorDeClaves{

    constructor(){
        this._contadorIDTrack = 0;
        this._contadorIDAlbum = 0;
        this._contadorIDArtista = 0;
    }

    generarClaveDeTrack(){
        this._contadorIDTrack += 1;        
        return this._contadorIDTrack;
    }

    generarClaveDeAlbum(){
        this._contadorIDAlbum += 1;
        return this._contadorIDAlbum;
    }

    generarClaveDeArtista(){
        this._contadorIDArtista += 1;
        return this._contadorIDArtista;
    }
}

module.exports = GeneradorDeClaves;