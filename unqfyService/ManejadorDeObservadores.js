class ManejadorDeObservadores{

    constructor(){
        this._observadores = []
    }

    get observadores(){return this._observadores;}

    agregarObservador(nuevoObservador){
        this._observadores.push(nuevoObservador);
    }

    updateDeAgregadoDeAlbum(jsOBJ){
        this._observadores.forEach(observador => observador.updatear("AgregadoDeAlbum", jsOBJ));
    }
}

module.exports = ManejadorDeObservadores