const deepEqual = require('deep-equal');

class Usuario {

    constructor(nroID, unNombre, unaEdad) {
       
        this._id = nroID;
        this._nombre = unNombre;
        this._edad = unaEdad; 
        this._registroDeCancionesEscuchadas = [];
    }

    get id(){return this._id;}
    get nombre(){return this._nombre;}
    get edad(){return this._edad;}

    set nombre(nuevoNombre){this._nombre = nuevoNombre;}
    set edad(nuevaEdad){this._edad = nuevaEdad;}
    
    escucharTrack(unaTrack) {
        let yaFueEscuchada;
        this._registroDeCancionesEscuchadas.forEach(tuple => {
            if(deepEqual(tuple[0], unaTrack, true)){
                yaFueEscuchada = true;
            }      
        })
        
        if(yaFueEscuchada){
            let cantVecesEscuchada = this._registroDeCancionesEscuchadas.find(tupla => deepEqual(tupla[0],unaTrack,true))[1];
            let arraySinRegistro = this._registroDeCancionesEscuchadas.filter(tupla => !deepEqual(tupla[0],unaTrack,true));
            
            this._registroDeCancionesEscuchadas = arraySinRegistro.concat([[unaTrack, (cantVecesEscuchada + 1)]])
        }else{
            this._registroDeCancionesEscuchadas.push([unaTrack, 1]);
        }
    }

    escucharPlaylist(unaPlaylist) {
        unaPlaylist.tracks.forEach(track => this.escucharTrack(track));
    }

    getTemasEscuchados() {
        return this._registroDeCancionesEscuchadas.map(tupla => tupla[0]);
    }
    
    getVecesQueEscuchoTema(unaTrack) {
        let tupla = this._registroDeCancionesEscuchadas.find(tupla => deepEqual(tupla[0],unaTrack,true));
        
        if(tupla !== undefined){
            return tupla[1];
        }else{
            return 0
        }
    }

    getTracksMasEscuchadosDe(nombreDeArtista){
        let listaDeTemasYCantidadDeVecesEscuchado = this._registroDeCancionesEscuchadas;

        return listaDeTemasYCantidadDeVecesEscuchado.filter(tupla => 
        tupla[0].albumAlquePertenece.autor.nombre === nombreDeArtista).sort((a,b) => {return b[1] - a[1]}).slice(0,3).map(tupla => 
        tupla[0]);
    }

}

module.exports = Usuario;