const Buscador = require('./Buscador');

class Database {

    constructor() {

        this._artistas = [];
        this._playList = [];
    }

    get artistas() { return this._artistas; }
    get playList(){return this._playList;}
    
    agregarArtista(unArtista) {
        this._artistas.push(unArtista);
    }

    eliminarArtista(unNombreDeArtista) {
        this._artistas = this._artistas.filter(artista => artista.nombre !== unNombreDeArtista);
    }
    //agregar playlist.
    agregarplaylist(unaplayList) {
        this._playList.push(unaplayList);
    }
    
     noHayPlayListConElMismoNombre(unNombre) {
        return this._playList.every(playList => playList.nombre !== unNombre);
    }

    eliminarPlaylist(unnombrePlayList) {
        this._playList = this._playList.filter(playlist => playlist.nombre !== unnombrePlayList);
    }
}

module.exports = Database;
