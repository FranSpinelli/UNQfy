// Error personalizado
class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
      super(message || name);
      this.name = name;
      this.status = statusCode;
      this.errorCode = errorCode;
    }
}
 
class WrongRoute extends APIError {
    constructor() {
        super('WrongRoute', 404, 'RESOURCE_NOT_FOUND');
    }  
}

class MissingValue extends APIError {
    constructor() {
        super('MissingValue', 400, 'BAD_REQUEST');
    }  
}

class InexistentRelatedSource extends APIError{
    constructor() {
        super('InexistentRelatedSource', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}

module.exports = {
   WrongRoute : WrongRoute,
   MissingValue : MissingValue,
   InexistentRelatedSource : InexistentRelatedSource
}