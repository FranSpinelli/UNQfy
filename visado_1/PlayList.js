const Errores = require('./Errores');

class PlayList {
    constructor(nombre, idPlayList, duracion) {

        this._nombre = nombre;
        this._idPlayList = idPlayList;
        this._duracion = duracion;
        this._genero = [];
        this._tracks = [];
    }


    get nombre() { return this._nombre; }
    get idPlayList() { return this._idPlayList; }
    get duracion() { return this._duracion; }
    get genero() { return this._genero; }
    get tracks() { return this._tracks; }


    agregarPlayList(unTrack, duracion, unGenero) {

        if (!this._tracks.includes(unaTrack) && this.noHayCancionConMismoTitulo(unaTrack.titulo)) {
            this._tracks.push(unaTrack);
        } else {
            throw new Errores.ElementoExistenteConMismoNombre(unaTrack.titulo, "una track", "este album");
        }

    }
    eliminarPlayList(PlayList) {
        return this._tracks.every(track => track.titulo !== unTitulo);
    }

    existePlayList(PlayList) {
        return (!this._idPlayList.includes(PlayList))
    }


} //fin clese
module.exports = PlayList;