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

class FechaInvalida extends Error {
  constructor(elemento){
    super("Fecha " + elemento + " invalida");
    this.name = "FechaInvalida";
  }
}

class ElementoDuplicado extends Error {
  constructor(elemento){
    super("Fecha " + elemento + " invalida");
    this.name = "FechaInvalida";
  }
}

module.exports = {
  ElementoExistenteConMismoNombre: ElementoExistenteConMismoNombre, 
  NoExisteElementoConID: NoExisteElementoConID,
  FechaInvalida: FechaInvalida,
  ElementoDuplicado : ElementoDuplicado
}