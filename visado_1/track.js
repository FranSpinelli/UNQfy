class Track {
    
    constructor(unTitulo, unosGeneros, unaDuracion, unAlbumAlQuePertenece, unID){

        this._titulo = unTitulo;
        this._generosMusicales = unosGeneros;
        this._duracion = unaDuracion;
        this._albumAlquePertenece = unAlbumAlQuePertenece;
        this._id = unID;
    }

    get titulo(){return this._titulo;}
    get generosMusicales(){return this._generosMusicales;}
    get duracion(){return this._duracion;}
    get albumAlquePertenece (){return this._albumAlquePertenece;}
    get id(){return this._id;}

}

module.exports = Track;