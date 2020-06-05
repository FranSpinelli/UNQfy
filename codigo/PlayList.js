class PlayList {
    constructor(nombre, idPlayList, duracion, generos, listaDeTracks) {

        this._nombre = nombre;
        this._idPlayList = idPlayList;
        this._duracion = duracion;
        this._genero = generos;
        this._tracks = listaDeTracks;
    }

    get nombre() { return this._nombre; }
    get idPlayList() { return this._idPlayList; }
    get duracion() { return this._duracion; }
    get genero() { return this._genero; }
    get tracks() { return this._tracks; }

    hasTrack(unaTrack){
        //este metodo estaba definido en los tests
        return this._tracks.filter( track => track === unaTrack).length === 1;
    }

    eliminarTrack(trackID){
        this._tracks = this._tracks.filter(track => track.id !== trackID);
    }

}

module.exports = PlayList;
