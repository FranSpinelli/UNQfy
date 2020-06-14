const Errores = require('./Errores');

class Artista{

    constructor(unNombre, unAñoDeNacimiento, unPais, unID){

        this._nombre = unNombre;
        this._añoDeNacimiento = unAñoDeNacimiento;
        this._pais = unPais;
        this._albums = [];
        this._id = unID;
    }

    get nombre(){return this._nombre;}
    get añoDeNacimiento(){return this._añoDeNacimiento;}
    get pais(){return this._pais;}
    get albums(){return this._albums;}
    get id(){return this._id;}

    set nombre(nuevoNombre){this._nombre = nuevoNombre;}
    set pais(nuevoPais){this._pais = nuevoPais;}

    agregarAlbum(unAlbum){
        if(!this._albums.includes(unAlbum) && this.noHayAlbumConElMismoNombre(unAlbum.nombre)){
            this._albums.push(unAlbum);
        }else{
            throw new Errores.ElementoExistenteConMismoNombre(unAlbum.nombre, "un album", "este artista");
        }
    }

    noHayAlbumConElMismoNombre(unNombre){
        return this._albums.every( album => album.nombre !== unNombre);
    }

    eliminarAlbum(unNombreDeAlbum){
        this._albums = this._albums.filter( album => album.nombre !== unNombreDeAlbum );
    }
}

module.exports = Artista;