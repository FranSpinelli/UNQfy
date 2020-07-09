class ArtistaInexistenteError extends Error{
    constructor(){
        super("No existe artista con el ID brindado");
        this.name = "ArtistaInexistente";
    }
}

module.exports = { ArtistaInexistenteError };