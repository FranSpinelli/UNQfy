class Track {
    
    constructor(unTitulo, unosGeneros, unaDuracion, unAlbumAlQuePertenece){

        this._titulo = unTitulo;
        this._generosMusicales = unosGeneros;
        this._duracion = unaDuracion;
        this._albumAlquePertenece = unAlbumAlQuePertenece;
    }

    get titulo(){return this._titulo;}
    get generosMusicales(){return this._generosMusicales;}
    get duracion(){return this._duracion;}
    get albumAlquePertenece (){return this._albumAlquePertenece;}
}

module.exports = Track;