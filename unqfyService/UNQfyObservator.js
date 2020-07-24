class UNQfyObservator{
    constructor(boolInteresadoEnNuevosAlbums, boolInteresadoEnCambiosEnArtistas){
        this._interesadoEnNuevosAlbums = boolInteresadoEnNuevosAlbums;
        this._interesadosEnCambiosEnArtistas = boolInteresadoEnCambiosEnArtistas;
    }

    get interesadoEnNuevosAlbums(){return this._interesadoEnNuevosAlbums;}
    get interesadoEnCambiosEnArtistas(){return this._interesadosEnCambiosEnArtistas;}

    //ABSTRACT METHODS-------------------------------------------------------------------
    notificarDeAgregarArtista() {
        throw new Error('You have to implement the method doSomething!');
    }

    notificarDeEliminarArtista() {
        throw new Error('You have to implement the method doSomething!');
    }

    notificarDeNuevoAlbum() {
        throw new Error('You have to implement the method doSomething!');
    }
}

module.exports = UNQfyObservator