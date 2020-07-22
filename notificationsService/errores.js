class ArtistaInexistenteError extends Error{
    constructor(){
        super("No existe artista con el ID brindado");
        this.name = "ArtistaInexistente";
    }
}

class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
        super(message || name);
        this.name = name;
        this.status = statusCode;
        this.errorCode = errorCode;
    }
}

class NotificationError extends APIError {
    constructor(){
        super('NotificationIsNotPosible', 500, "INTERNAL_SERVER_ERROR");
    }
}

class InvalidURL extends APIError {
    constructor(){
        super('InvalidURL', 404, "RESOURCE_NOT_FOUND");
    }
}

class InvalidJSON extends APIError {
    constructor(){
        super('InvalidJSON', 400, 'BAD_REQUEST')
    }
}

module.exports = { 
    ArtistaInexistenteError: ArtistaInexistenteError,
    NotificationError: NotificationError,
    InvalidURL: InvalidURL,
    InvalidJSON: InvalidJSON
};