const Errores = require('./Errores');

class Usuario {

    constructor(idUsuario) {
        this._idUsuario = idUsuario;
        this._nombreUsuario = nombreUsuario;

    }


    get idUsuario() { return this._idUsuario; }
    get nombreUsuario() { return this._nombreUsuario; }
        //en esta clase se crea un idUsuario y nombreUsuario 
        //donde crea la identidad del usuario para el proyecto.
        //las play list se encarga unqfy.js.


}

module.exports = Usuario;