const errores = require('./Errores');

function errorHandler(err, req, res, next) {

    if (err instanceof errores.NotificationError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.name === "ArtistaInexistente"){
        res.status(400).json({
            status: 400,
            errorCode: "RELATED_RESOURCE_NOT_FOUND"
        });
    } else if (err instanceof errores.InvalidJSON){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err instanceof errores.InvalidURL){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
      // body-parser error para JSON invalido
      res.status(err.status);
      res.json({status: err.status, errorCode: 'INVALID_JSON'});
    } else {
      res.status(500).json({
        status: 500,
        errorCode: "INTERNAL_SERVER_ERROR"
      })
    }
}

module.exports = { errorHandler }