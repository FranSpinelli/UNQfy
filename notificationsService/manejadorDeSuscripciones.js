class ManejadorDeSuscripciones {

    constructor(){
        this._suscripcionesMap = new Map();
    }

    get suscripcionesMap(){return this._suscripcionesMap;}

    agregarSuscripcionAArtista(artistaID, emailDeSuscriptor){

        let listaDeMails = this._suscripcionesMap.get(artistaID);

        if(listaDeMails !== undefined){
            this.agregarSuscriptorSiNoEstaSuscripto(listaDeMails, emailDeSuscriptor);
        }else{
            this._suscripcionesMap.set(artistaID, [emailDeSuscriptor]);
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
            return listaDeMails;
        }else{
            return [];
        }
    }

    eliminarTodosLosSuscriptoresDe(artistaID){
        
        this._suscripcionesMap.delete(artistaID)
    }
}

module.exports = { ManejadorDeSuscripciones };