const Errores = require('./Errores');

class PlayList {
    constructor(nombre, idPlayList, duracion, genero) {

        this._nombre = nombre;
        this._idPlayList = idPlayList;
        this._duracion = duracion;
        this._genero = genero;
        this._tracks = [];
    }


    get nombre() { return this._nombre; }
    get idPlayList() { return this._idPlayList; }
    get duracion() { return this._duracion; }
    get genero() { return this._genero; }
    get tracks() { return this._tracks; }


    agregarPlayList(unTrack) {

        if (!this._tracks.includes(unaTrack) && this.NoexisteTracks(unaTrack.titulo) && this.NoIgualGeneroTracks(unTrack.genero)) {
            this._tracks.push(unaTrack);
        } else {
            throw new Errores.ElementoExistenteConMismoNombre(unaTrack.titulo, "una track", "este album");
        }

    }
    eliminarPlayList(tituloTrack) {
        return this._tracks.filter(track => track.titulo !== tituloTrack);
    }

    NoexisteTracks(nomtitulo) {
        return this._tracks.every(track => track.titulo !== nomtitulo);
    }
    NoIgualGeneroTracks(ungenero) {
        return this._tracks.every(track => track.genero !== ungenero);
    }

} //fin clese
module.exports = PlayList;
