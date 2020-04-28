class Album{

    constructor(unNombre, unAñoDeLanzamiento, unID){

        this._nombre = unNombre;
        this._añoDeLanzamiento = unAñoDeLanzamiento;
        this._tracks = [];
        this._id =  unID;
    }

    get nombre(){return this._nombre;}
    get añoDeLanzamiento(){return this._añoDeLanzamiento;}
    get tracks(){return this._tracks;}
    get id(){return this._id;}

    agregarTrack(unaTrack){
        if(!this._tracks.includes(unaTrack) && this.noHayCancionConMismoTitulo(unaTrack.titulo)){
            this._tracks.push(unaTrack);
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