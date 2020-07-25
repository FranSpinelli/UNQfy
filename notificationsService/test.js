const assert = require('chai').assert;

const manejadorDeSus = require('./ManejadorDeSuscripciones');
const errores = require('./Errores');

describe('Manejador de suscripciones', function() {
    let manejadorDeSuscripciones;
  
    beforeEach(() => {
      manejadorDeSuscripciones = new manejadorDeSus.ManejadorDeSuscripciones();
    });

    it('test agregarSuscripcionAArtista', () => {

        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1)[0], "mail");

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1)[0], "mail");
    });

    it('test quitarSuscripcionAArtista', () => {
        
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1)[0], "mail");

        manejadorDeSuscripciones.quitarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.quitarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);
    });

    it('test eliminarTodosLosSuscriptoresDe', () => {

        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1)[0], "mail");

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail2");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 2);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1)[1], "mail2");

        manejadorDeSuscripciones.eliminarTodosLosSuscriptoresDe(1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.eliminarTodosLosSuscriptoresDe(1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);
    });   
});