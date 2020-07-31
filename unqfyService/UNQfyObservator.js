class UNQfyObservator{

    constructor(clienteDeServicioExterno){
        this._cliente = clienteDeServicioExterno;
    }
    //ABSTRACT METHODS-------------------------------------------------------------------
    updatear() {
        throw new Error('You have to implement the method doSomething!');
    }
}

module.exports = UNQfyObservator