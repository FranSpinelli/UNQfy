class Artista{

    constructor(unNombre, unAñoDeNacimiento, unID){

        this._nombre = unNombre;
        this._añoDeNacimiento = unAñoDeNacimiento;
        this._albums = [];
        this._id = unID;
    }

    get nombre(){return this._nombre;}
    get añoDeNacimiento(){return this._añoDeNacimiento;}
    get albums(){return this._albums;}
    get id(){return this._id;}

    agregarAlbum(unAlbum){
        if(!this._albums.includes(unAlbum) && this.noHayAlbumConElMismoNombre(unAlbum.nombre)){
            this._albums.push(unAlbum);
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