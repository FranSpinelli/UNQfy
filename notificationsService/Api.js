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

router.post('/artist', (req,res) => {

    chequearParametroDeLaQuery(req.query.id);
    notificationService.agregarArtista(parseInt(req.query.id));
    res.sendStatus(200);
})

router.delete('/artist', (req, res) => {

    chequearParametroDeLaQuery(req.query.id);
    notificationService.eliminarArtista(parseInt(req.query.id));
    res.sendStatus(200);
})

router.post('/subscribe', (req, res) => {

    analizarJSONRecibido(req.body)
    notificationService.agregarSuscriptorAArtistaConID(req.body.artistID, req.body.email);
    res.sendStatus(200);
  
})

router.post('/unsubscribe', (req,res) => {

    analizarJSONRecibido(req.body)
    notificationService.agregarSuscriptorAArtistaConID(req.body.artistID, req.body.email);
    res.sendStatus(200);
})

router.get('/subscriptions', (req,res) => {

    chequearParametroDeLaQuery(req.query.artistID);
    let listaDeSuscriptores = notificationService.getSuscripcionesDe(parseInt(req.query.artistID));
    let response = {
        artistID: req.query.artistID,
        suscriptors : listaDeSuscriptores
    }

    res.status(200).json(response);
})

router.delete('/subscriptions', (req, res) => {

    if(req.body.artistID === undefined){
        throw new errores.InvalidJSON();
    }
    notificationService.eliminarSuscriptoresDeArtistaConID(req.body.artistID);
    res.sendStatus(200);
})

router.post('/notify', (req, res, next) => {

    chequearBody(req.body.artistID, req.body.subject, req.body.message);
    notificationService.enviarMensajeASuscriptoresDe(req.body.artistID, req.body.subject, req.body.message).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        //NO SE POR Q CON THROW NO FUNCIONABA
        next(new errores.NotificationError())
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

function analizarJSONRecibido(json,){

    if(json.artistID === undefined || json.email === undefined){
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