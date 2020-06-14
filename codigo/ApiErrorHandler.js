const apiErrors = require("./ErroresApi.js");
const errores = require('./Errores.js');

function errorHandler(err, req, res, next) {
    
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if ((err instanceof errores.ElementoDuplicado) || (err instanceof errores.ElementoExistenteConMismoNombre)){
        res.status(409).json({status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS'});

    } else if (err instanceof errores.FechaInvalida){
        res.status(400).json({status: 400, errorCode: "INVALID_DATE"});

    } else if (err instanceof errores.NoExisteElementoConID){
        res.status(404).json({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});

    } else if (err.type === 'entity.parse.failed'){
        // body-parser error para JSON invalido
        res.status(err.status);
        res.json({
            status: err.status,
            errorCode: 'BAD_REQUEST'
        });

    }else if (err instanceof apiErrors.MissingValue){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});

    }else if (err instanceof apiErrors.InexistentRelatedSource){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});

    } else if(err instanceof apiErrors.WrongRoute){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});

    }else {
        next(err);

    }
 }

 module.exports = errorHandler
 