const loggingMod = require('./LoggingService');
const logglyMod = require('./LogglyClient');

const loggingService = new loggingMod();
const logglyClient = new logglyMod();

//const errorHandler = require('./ErrorHandler');
const bodyParser = require('body-parser');

const port = 9000;

const express = require('express');
const app = express();
const router = express.Router();

app.use(bodyParser.json());

router.get('/', (req,res) => {
    res.json({ message: 'yay! Bienvenido a la api del servicio de logging de UNQfy' });
});
//---------------------------------------------------------------------------------

router.post('/logg/addition', (req, res) => {
   let logg = 'INFO: ' + req.body.message; 
   loggingService.loggearSucesoLocalmente(logg);
   logglyClient.loggearInfoLogRemotamente(req.body.message); 

   res.sendStatus(201);
})

router.post('/logg/removal', (req,res) => {
    let logg = 'WARNING: ' + req.body.message; 
    loggingService.loggearSucesoLocalmente(logg);
    logglyClient.loggearWarningLogRemotamente(req.body.message);

    res.sendStatus(201);
})

router.post('/logg/error', (req,res) => {
    let logg = 'ERROR: ' + req.body.message; 
    loggingService.loggearSucesoLocalmente(logg);
    logglyClient.loggearErrorLogRemotamente(req.body.message);
 
    res.sendStatus(201);
})

//---------------------------------------------------------------------------------

app.use('/api', router);
/*app.use(function(req,res){
    throw new errores.InvalidURL();
});*/

//app.use(errorHandler.errorHandler);
app.listen(port, () => console.log('where magic happens'));