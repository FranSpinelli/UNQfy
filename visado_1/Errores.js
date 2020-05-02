class ElementoExistenteConMismoNombre extends Error {
    constructor(unNombre, elementoRepetido, lugarDondeExisteElementoConMismoNombre) {
      super("Ya existe " + elementoRepetido + " con nombre: " + unNombre + " en: " + lugarDondeExisteElementoConMismoNombre);
      this.name = "ElementoExistenteConMismoNombre";  
    }
}

class NoExisteElementoConID extends Error {
    constructor(elemento, id) {
      super("No existe " + elemento + " con ID: " + id);
      this.name = "NoExisteElementoConID";  
    }
}

module.exports = {
  ElementoExistenteConMismoNombre: ElementoExistenteConMismoNombre, 
  NoExisteElementoConID: NoExisteElementoConID
}