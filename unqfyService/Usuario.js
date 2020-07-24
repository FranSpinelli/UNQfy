let Multiset = require('mnemonist/multi-set');

class Usuario {

    constructor() {
       this._registroDeCancionesEscuchadas = new Multiset();
    }


    escucharTrack(unaTrack) {
        this._registroDeCancionesEscuchadas.add(unaTrack);
    }

    escucharPlaylist(unaPlaylist) {
        unaPlaylist.tracks.forEach(track => this.escucharTrack(track));
    }

    getTemasEscuchados() {
        return Array.from(this._registroDeCancionesEscuchadas.keys());
    }
    
    getVecesQueEscuchoTema(unaTrack) {
        return this._registroDeCancionesEscuchadas.multiplicity(unaTrack);
    }

    getTracksMasEscuchadosDe(nombreDeArtista){
        let listaDeTemasYCantidadDeVecesEscuchado = Array.from(this._registroDeCancionesEscuchadas.multiplicities());

        return listaDeTemasYCantidadDeVecesEscuchado.filter(elemento => 
        elemento[0].albumAlquePertenece.autor.nombre === nombreDeArtista).sort((a,b) => {return b[1] - a[1]}).slice(0,3).map(elemento => 
        elemento[0]);
    }

}

module.exports = Usuario;