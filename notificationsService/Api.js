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

    notificationService.agregarArtista(parseInt(req.query.id));
    res.sendStatus(200);
})

router.delete('/artist', (req, res) => {

    notificationService.eliminarArtista(parseInt(req.query.id));
    res.sendStatus(200);
})

router.post('/subscribe', (req, res) => {

    notificationService.agregarSuscriptorAArtistaConID(req.body.artistID, req.body.email);
    res.sendStatus(200);
})

router.post('/unsubscribe', (req,res) => {

    notificationService.agregarSuscriptorAArtistaConID(req.body.artistID, req.body.email);
    res.sendStatus(200);
})

router.get('/subscriptions', (req,res) => {

    let listaDeSuscriptores = notificationService.getSuscripcionesDe(parseInt(req.query.artistID));
    let response = {
        artistID: req.query.artistID,
        suscriptors : listaDeSuscriptores
    }

    res.status(200).json(response);
})

router.delete('/subscriptions', (req, res) => {

    notificationService.eliminarSuscriptoresDeArtistaConID(req.body.artistID);
    res.sendStatus(200);
})

router.post('/notify', (req, res) => {

    notificationService.enviarMensajeASuscriptoresDe(req.body.artistID, req.body.subject, req.body.message).then(response => {
        res.sendStatus(200);
    });
})

//---------------------------------------------------------------------------------

app.use('/api', router);
app.use(function(req,res){
    //error ruta incorrecta
});

app.listen(port, () => console.log('where magic happens'));