;
const {EmailSender} = require('./EmailSender');
const {ManejadorDeSuscripciones} = require('./ManejadorDeSuscripciones');


class NotificationService {

    constructor() {
        this._mailSender = new EmailSender();
        this._manejadorDeSuscripciones = new ManejadorDeSuscripciones();
    }
    
    agregarArtista(artistaID){
        this._manejadorDeSuscripciones.agregarArtista(artistaID);
    }

    eliminarArtista(artistaID){
        this._manejadorDeSuscripciones.quitarArtista(artistaID);
    }

    agregarSuscriptorAArtistaConID(artistaID, email){
        this._manejadorDeSuscripciones.agregarSuscripcionAArtista(artistaID,email);
    }

    eliminarSuscriptosAArtistaConID(artistaID, email){
        this._manejadorDeSuscripciones.quitarSuscripcionAArtista(artistaID,email);
    }

    getSuscripcionesDe(artistaID){
        return this._manejadorDeSuscripciones.suscriptoresDe(artistaID)
    }

    eliminarSuscriptoresDeArtistaConID(artistaID){
        this._manejadorDeSuscripciones.eliminarTodosLosSuscriptoresDe(artistaID)
    }

    enviarMensajeASuscriptoresDe(artistaID, subject, message){
        
        let listaDeMails = this._manejadorDeSuscripciones.suscriptoresDe(artistaID);
        let promiseList = [];

        listaDeMails.forEach( mail => {
            let mailPromise = this._mailSender.enviarMailCon(subject, message, mail);
            promiseList.push(mailPromise);
        })

        return Promise.all(promiseList);
    }
}

module.exports = { NotificationService }