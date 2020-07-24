const assert = require('chai').assert;

const manejadorDeSus = require('./ManejadorDeSuscripciones');
const errores = require('./Errores');

describe('Manejador de suscripciones', function() {
    let manejadorDeSuscripciones;
  
    beforeEach(() => {
      manejadorDeSuscripciones = new manejadorDeSus.ManejadorDeSuscripciones();
    });
  
    it('test agregarArtista', () => {
        
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 0);

        manejadorDeSuscripciones.agregarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.get(1).length,0);

        manejadorDeSuscripciones.agregarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 1);
    });

    it('test quitarArtista', () => {
        
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 0);

        manejadorDeSuscripciones.agregarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 1);

        manejadorDeSuscripciones.quitarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 0);

        manejadorDeSuscripciones.quitarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 0);
    });

    it('test agregarSuscripcionAArtista', () => {
    
        manejadorDeSuscripciones.agregarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);
    });

    it('test agregarSuscripcionAArtista caso de artista inexistente', () => {

        assert.throws( () => {manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");}, errores.ArtistaInexistenteError, 
        "No existe artista con el ID brindado");
    });

    it('test quitarSuscripcionAArtista', () => {
    
        manejadorDeSuscripciones.agregarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);

        manejadorDeSuscripciones.quitarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.quitarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);
    });

    it('test quitarSuscripcionAArtista caso de artista inexistente', () => {

        assert.throws( () => {manejadorDeSuscripciones.quitarSuscripcionAArtista(1,"mail");}, errores.ArtistaInexistenteError, 
        "No existe artista con el ID brindado");
    });

    it('test eliminarTodosLosSuscriptoresDe', () => {
    
        manejadorDeSuscripciones.agregarArtista(1);
        assert.equal(manejadorDeSuscripciones.suscripcionesMap.size, 1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 1);

        manejadorDeSuscripciones.agregarSuscripcionAArtista(1,"mail2");
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 2);

        manejadorDeSuscripciones.eliminarTodosLosSuscriptoresDe(1);
        assert.equal(manejadorDeSuscripciones.suscriptoresDe(1).length, 0);
    });

    it('test eliminarTodosLosSuscriptoresDe caso de artista inexistente', () => {

        assert.throws( () => {manejadorDeSuscripciones.eliminarTodosLosSuscriptoresDe(1);}, errores.ArtistaInexistenteError, 
        "No existe artista con el ID brindado");
    });    
});