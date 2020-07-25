const errorHandler = require('./ErrorHandler');
const errores = require('./Errores');

const notificationMod = require('./NotificationService');
const notificationService = new notificationMod.NotificationService();

const bodyParser = require('body-parser');

const port = 8090;

const express = require('express');
const app = express();
const router = express.Router();

app.use(bodyParser.json());

router.get('/', (req,res) => {
    res.json({ message: 'yay! Bienvenido a la api del servicio de notificaciones de UNQfy' });
});
//---------------------------------------------------------------------------------

router.post('/subscribe', (req, res, next) => {

    analizarJSONRecibido(req.body)
    notificationService.agregarSuscriptorAArtistaConID(req.body.artistID, req.body.email).then(respuesta => {
        res.sendStatus(200);
    }).catch(error => {
        next(error);
    });
})

router.post('/unsubscribe', (req,res,next) => {

    analizarJSONRecibido(req.body)
    notificationService.eliminarSuscriptorAArtistaConID(req.body.artistID, req.body.email).then(respuesta => {
        res.sendStatus(200);
    }).catch(error => {
        next(error);
    });
    
})

router.get('/subscriptions', (req,res,next) => {

    chequearParametroDeLaQuery(req.query.artistID);
    notificationService.getSuscripcionesDe(parseInt(req.query.artistID)).then(respuesta => {
        let response = {
            artistID: req.query.artistID,
            suscriptors : respuesta
        }
        res.status(200).json(response);
    }).catch(error => {
        next(error);
    });
})

router.delete('/subscriptions', (req, res, next) => {

    if(req.body.artistID === undefined){
        throw new errores.InvalidJSON();
    }
    notificationService.eliminarSuscriptoresDeArtistaConID(req.body.artistID).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        next(error)
    });
})

router.post('/notify', (req, res, next) => {

    chequearBody(req.body.artistID, req.body.subject, req.body.message);
    notificationService.enviarMensajeASuscriptoresDe(req.body.artistID, req.body.subject, req.body.message).then(response => {
        
        Promise.all(response).then(resp => {
            res.sendStatus(200);
        }).catch(error => {
            res.sendStatus(200);
        })
    }).catch(error => {
            next(error)
    })
})

//---------------------------------------------------------------------------------

app.use('/api', router);
app.use(function(req,res){
    throw new errores.InvalidURL();
});

app.use(errorHandler.errorHandler);
app.listen(port, () => console.log('where magic happens'));

//-----------------------------------------------------------------------------------

function analizarJSONRecibido(json){

    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(json.artistID === undefined || json.email === undefined || !regex.test(json.email)){
        throw new errores.InvalidJSON();
    }
}

function chequearParametroDeLaQuery(paramDeLaQuery){

    if(paramDeLaQuery === undefined){
        throw new errores.InvalidJSON();
    }
}

function chequearBody(artistaID, subject, message){
    if(artistaID === undefined || subject === undefined || message === undefined){
        throw new errores.InvalidJSON();
    }
}