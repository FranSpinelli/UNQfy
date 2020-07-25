const {EmailSender} = require('./EmailSender');
const {ManejadorDeSuscripciones} = require('./ManejadorDeSuscripciones');
const UNQfyClient = require('./unqfyClient');
const errores = require('./Errores');

class NotificationService {

    constructor() {
        this._mailSender = new EmailSender();
        this._manejadorDeSuscripciones = new ManejadorDeSuscripciones();
        this._unqfyClient = new UNQfyClient();
    }

    agregarSuscriptorAArtistaConID(artistaID, email){
        return this._unqfyClient.getArtistaConID(artistaID).then(res => {

            this._manejadorDeSuscripciones.agregarSuscripcionAArtista(artistaID,email);
        }).catch(error => {
            
            this.analizarError(error);
        })
    }

    eliminarSuscriptorAArtistaConID(artistaID, email){
        return this._unqfyClient.getArtistaConID(artistaID).then(res => {

            this._manejadorDeSuscripciones.quitarSuscripcionAArtista(artistaID,email);  
        }).catch(error => {

            this.analizarError(error);
        })
    }

    getSuscripcionesDe(artistaID){        
        return this._unqfyClient.getArtistaConID(artistaID).then(res => {

            return this._manejadorDeSuscripciones.suscriptoresDe(artistaID);
        }).catch(error => {

            this.analizarError(error);
        })
    }

    eliminarSuscriptoresDeArtistaConID(artistaID){
        return this._unqfyClient.getArtistaConID(artistaID).then(res => {

            this._manejadorDeSuscripciones.eliminarTodosLosSuscriptoresDe(artistaID)
        }).catch(error => {

            this.analizarError(error);
        })
    }

    enviarMensajeASuscriptoresDe(artistaID, subject, message){
        return this._unqfyClient.getArtistaConID(artistaID).then(res => {

            let listaDeMails = this._manejadorDeSuscripciones.suscriptoresDe(artistaID);
            return this.realizarEnvio(listaDeMails);
        }).catch(err => {
            
            this.analizarError(err);
        })
    }

    realizarEnvio(listaDeMails){
        let promiseList = [];
        listaDeMails.forEach( mail => {
            let mailPromise = this._mailSender.enviarMailCon(subject, message, mail);
            promiseList.push(mailPromise);
        })

        return Promise.all(promiseList);
    }

    analizarError(error){
        
        if(error.error.errorCode === "RESOURCE_NOT_FOUND"){
            throw new errores.ArtistaInexistenteError();
        }else{
            throw error;
        }
    }
}

module.exports = { NotificationService }