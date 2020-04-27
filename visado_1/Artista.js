class Artista{

    constructor(unNombre, unAñoDeNacimiento){

        this._nombre = unNombre;
        this._añoDeNacimiento = unAñoDeNacimiento;
        this._albumes = [];
    }

    get nombre(){return this._nombre;}
    get añoDeNacimiento(){return this._añoDeNacimiento;}
    get albumes(){return this._albumes;}

    agregarAlbum(unAlbum){
        if(!this._albumes.includes(unAlbum)){
            this._albumes.push(unAlbum);
        }
    }

    eliminarAlbum(unNombreDeAlbum){
        this._albumes = this._albumes.filter( album => album.nombre !== unNombreDeAlbum );
    }
}

module.exports = Artista;