let errores = require('./errores');

class ManejadorDeSuscripciones {

    constructor(){
        this._suscripcionesMap = new Map();
    }

    get suscripcionesMap(){return this._suscripcionesMap;}

    agregarArtista(artistaID){

        if(!this._suscripcionesMap.has(artistaID)){
            this._suscripcionesMap.set(artistaID,[]);
        }
    }

    quitarArtista(artistaID){
        this._suscripcionesMap.delete(artistaID);
    }

    agregarSuscripcionAArtista(artistaID, emailDeSuscriptor){

        let listaDeMails = this._suscripcionesMap.get(artistaID);

        if(listaDeMails !== undefined){
            this.agregarSuscriptorSiNoEstaSuscripto(listaDeMails, emailDeSuscriptor);
        }else{
            throw new errores.ArtistaInexistenteError();
        }
    }

    agregarSuscriptorSiNoEstaSuscripto(listaDeMails, emailDeSuscriptor){

        if(!listaDeMails.includes(emailDeSuscriptor)){
            listaDeMails.push(emailDeSuscriptor);
        }
    }

    quitarSuscripcionAArtista(artistaID, emailDeSuscriptor){

        let listaDeMails = this._suscripcionesMap.get(artistaID);

        if(listaDeMails !== undefined){
            this.eliminarSuscriptorSiEstaSuscripto(listaDeMails, emailDeSuscriptor);
        }else{
            throw new errores.ArtistaInexistenteError()        
        }
    }

    eliminarSuscriptorSiEstaSuscripto(listaDeMails, emailDeSuscriptor){

        let index = listaDeMails.indexOf(emailDeSuscriptor);

        if(index > -1){
            listaDeMails.splice(index,1);
        }
    }

    suscriptoresDe(artistaID){

        let listaDeMails = this._suscripcionesMap.get(artistaID);

        if(listaDeMails !== undefined){
            return listaDeMails
        }else{
            throw new errores.ArtistaInexistenteError();
        }
    }

    eliminarTodosLosSuscriptoresDe(artistaID){

        if(!this._suscripcionesMap.delete(artistaID)){
            throw new errores.ArtistaInexistenteError();
        }else{
            this._suscripcionesMap.set(artistaID, []);
        }
    }
}

module.exports = { ManejadorDeSuscripciones };