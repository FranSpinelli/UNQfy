const Buscador = require('./Buscador');

class Database{

    constructor(){

        this._artistas = [];
    }

    get artistas(){return this._artistas;}

    agregarArtista(unArtista){
        this._artistas.push(unArtista);
    }

    noHayArtistaConElMismoNombre(unNombre){
        return this._artistas.every(artista => artista.nombre !== unNombre);
    }

    eliminarArtista(unNombreDeArtista){
        this._artistas = this._artistas.filter( artista => artista.nombre !== unNombreDeArtista );
    }
}

module.exports = Database;