class ManejadorDeObservadores{

    constructor(){
        this._observadores = []
    }

    get observadores(){return this._observadores;}

    agregarObservador(nuevoObservador){
        this._observadores.push(nuevoObservador);
    }

    updateDeAgregadoDeArtista(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("AgregadoDeArtista", jsOBJ));
    }

    updateDeAgregadoDeAlbum(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("AgregadoDeAlbum", jsOBJ));
    }

    updateDeAgregadoDeTrack(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("AgregadoDeTrack", jsOBJ));
    }

    updateDeEliminadoDeArtista(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("EliminadoDeArtista", jsOBJ));
    }

    updateDeEliminadoDeAlbum(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("EliminadoDeAlbum", jsOBJ));
    }

    updateDeEliminadoDeTrack(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("EliminadoDeTrack", jsOBJ));
    }

    updateErrorDeModelo(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("ErrorDeModelo", jsOBJ));
    }
}

module.exports = ManejadorDeObservadores