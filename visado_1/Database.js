class Database{

    constructor(){

        this._artistas = [];
        this._generadorDeClaves = new GeneradorDeClaves();
    }

    get artistas(){return this._artistas;}

    agregarArtista(unArtista){
        if(!this._artistas.includes(unArtista) && this.noHayArtistaConElMismoNombre(unArtista.nombre)){
            this._artistas.push(unArtista);
        }
    }

    noHayArtistaConElMismoNombre(unNombre){
        return this._artistas.every(artista => artista.nombre !== unNombre);
    }

    eliminarArtista(unNombreDeArtista){
        this._artistas = this._artistas.filter( artista => artista.nombre !== unNombreDeArtista );
    }

    generarClaveDeTrack(){return this._generadorDeClaves.generarClaveDeTrack();}
    generarClaveDeAlbum(){return this._generadorDeClaves.generarClaveDeAlbum();}
    generarClaveDeArtista(){return this._generadorDeClaves.generarClaveDeArtista();}
}

class GeneradorDeClaves{

    constructor(){
        this._contadorIDTrack = 0;
        this._contadorIDAlbum = 0;
        this._contadorIDArtista = 0;
    }

    generarClaveDeTrack(){
        this._contadorIDTrack += 1;        
        return this._contadorIDTrack;
    }

    generarClaveDeAlbum(){
        this._contadorIDAlbum += 1;
        return this._contadorIDAlbum;
    }

    generarClaveDeArtista(){
        this._contadorIDArtista += 1;
        return this._contadorIDArtista;
    }
}

module.exports = Database;