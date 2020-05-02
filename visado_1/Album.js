const Errores = require('./Errores');

class Album{

    constructor(unNombre, unAñoDeLanzamiento, unID, unAutor){

        this._nombre = unNombre;
        this._añoDeLanzamiento = unAñoDeLanzamiento;
        this._tracks = [];
        this._id =  unID;
        this._autor = unAutor;
    }

    get nombre(){return this._nombre;}
    get añoDeLanzamiento(){return this._añoDeLanzamiento;}
    get tracks(){return this._tracks;}
    get id(){return this._id;}
    get autor(){return this._autor;}

    agregarTrack(unaTrack){
        if(!this._tracks.includes(unaTrack) && this.noHayCancionConMismoTitulo(unaTrack.titulo)){
            this._tracks.push(unaTrack);
        }else{
            throw new Errores.ElementoExistenteConMismoNombre(unaTrack.titulo, "una track", "este album");
        }
    }

    noHayCancionConMismoTitulo(unTitulo){
        return this._tracks.every( track => track.titulo !== unTitulo);
    }

    eliminarTrack(unNombreDeTrack){
        this._tracks = this._tracks.filter( track => track.titulo !== unNombreDeTrack );
    }
    
}

module.exports = Album;