let Multiset = require('mnemonist/multi-set');

class Usuario {

    constructor(nroID, unNombre, unaEdad) {
       
        this._id = nroID;
        this._nombre = unNombre;
        this._edad = unaEdad; 
        this._registroDeCancionesEscuchadas = new Multiset();
    }

    get id(){return this._id;}
    get nombre(){return this._nombre;}
    get edad(){return this._edad;}

    set nombre(nuevoNombre){this._nombre = nuevoNombre;}
    set edad(nuevaEdad){this._edad = nuevaEdad;}
    
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