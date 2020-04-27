class Album{

    constructor(unNombre, unAñoDeLanzamiento){

        this._nombre = unNombre;
        this._añoDeLanzamiento = unAñoDeLanzamiento;
        this._tracks = [];
    }

    get nombre(){return this._nombre;}
    get añoDeLanzamiento(){return this._añoDeLanzamiento;}
    get tracks(){return this._tracks;}

    agregarTrack(unaTrack){
        if(!this._tracks.includes(unaTrack)){
            this._tracks.push(unaTrack);
        }
    }

    eliminarTrack(unNombreDeTrack){
        this._tracks = this._tracks.filter( track => track.titulo !== unNombreDeTrack );
    }
    
}

module.exports = Album;