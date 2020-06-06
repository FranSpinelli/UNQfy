class Track {
    
    constructor(unTitulo, unosGeneros, unaDuracion, unAlbumAlQuePertenece, unID){

        this._titulo = unTitulo;
        this._generosMusicales = unosGeneros;
        this._duracion = unaDuracion;
        this._albumAlquePertenece = unAlbumAlQuePertenece;
        this._id = unID;
        this._lyrics = undefined;
    }

    get titulo(){return this._titulo;}
    get generosMusicales(){return this._generosMusicales;}
    get duracion(){return this._duracion;}
    get albumAlquePertenece(){return this._albumAlquePertenece;}
    get id(){return this._id;}

    getLyrics(unApiCaller){
        if(this._lyrics === undefined){
            return  unApiCaller.getTrackLyrics(this._titulo, this._albumAlquePertenece.autor).then( response => {
                this._lyrics = response.message.body.lyrics.lyrics_body;
            }).then(() => {
                return this._lyrics
            }); 
        }else{
            return new Promise((resolve, reject) => resolve(this._lyrics));
        }
    }
}

module.exports = Track;