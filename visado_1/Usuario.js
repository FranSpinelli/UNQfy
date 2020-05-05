const Errores = require('./Errores');

class Usuario {

    constructor(idUsuario) {
        this._idUsuario = idUsuario;
        this._nombreUsuario = nombreUsuario;
        this._playList = [];
    }


    get idUsuario() { return this._idUsuario; }
    get nombreUsuario() { return this._nombreUsuario; }
    get PlayList() { return this._playList; }

    escucharTema(NombreDeTema) {


    }

    escucharPlaylist(NombrePlaylist) {
        //this._playList.push(NombrePlaylist);

    }

    getTemasEscuchados() {

        //recorre con el foreach y muestra la cantidad de elementos
        // return this._playList.forEach(Elemento => console.log(Elemento))

    }
    getVecesQueEscuchoTema(NombreDeTema) {
        /*
        this._playList.forEach(elemento); {
            if (elemento.NombreDeTema === NombreDeTema)

                return cant + 1;
        }
        return cant;
*/
    }


}

module.exports = Usuario;