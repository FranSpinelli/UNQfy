const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy



function getUNQfy(filename = 'data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
  
  function saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
  }

  class Comando{
      
      //anto
    /*
    static mapearListaDePlayList(listaDePlayList) {
            if (listaDePlayList.length > 0) {
                let resultado = [];
                listaDePlayList.forEach(playList => {
                    let mappedPlayLsit = {
                        nombre: playList.nombre,
                        duracion: playList.duracion,
                        genero: playList.genero.map(playList => playList.genero).toString(),
                        tracks: playList.tracks.map(playList => playList.tracks).flat().map(track => track.titulo).toString()
                    }
                    resultado.push(mappedPlayLsit);
                })
                return resultado;
            } else {
                return "No existe ninguna PlayList con ese nombre"
            }
        }
        */
    //anto

    static mapearListaDeArtistas(listaDeArtistas){
        if(listaDeArtistas.length > 0){
            let resultado = [];
            listaDeArtistas.forEach( artista => {
                let mappedArtist = {
                    nombre: artista.nombre, 
                    'año de nacimiento': artista.añoDeNacimiento, 
                    pais: artista.pais,
                    id: artista.id,
                    albums: artista.albums.map(album => album.nombre).toString(),
                    tracks: artista.albums.map( album => album.tracks).flat().map(track => track.titulo).toString()
                }
                resultado.push(mappedArtist);
            })
            return resultado;
        }else{
            return "No existe ningun artista con ese nombre"
        }
    }
    
    static mapearListaDeAlbums(listaDeAlbums){
        if(listaDeAlbums.length > 0){
            let resultado = [];
            listaDeAlbums.forEach(album => {
                let mappedAlbum = {
                    nombre: album.nombre, 
                    año: album.añoDeLanzamiento,
                    id: album.id,
                    autor: album.autor.nombre,
                    tracks: album.tracks.map( track => track.titulo).toString()
                }
                resultado.push(mappedAlbum);
            })
            return resultado;
        }else{
            return "No existe ningun album con ese nombre"
        }
    }
    
    static mapearListaDeTracks(listaDeTracks){
        if (listaDeTracks.length > 0){
            let resultado = [];
            listaDeTracks.forEach(track => {
                let trackMappeada = {
                    titulo: track.titulo,
                    duracion: track.duracion + " segs",
                    generos: track.generosMusicales,
                    album: track.albumAlquePertenece.nombre,
                    id: track.id 
                }
                resultado.push(trackMappeada);
            });
            return resultado;
        }else{
            return "No existe ninguna track con ese nombre"
        }
    }
    
    static comandoEjecutadoConExito(unaUNQFY){
        console.log("Comando ejecutado con exito");
        saveUNQfy(unaUNQFY);
    }
}

class ComandoInexistente{

    static execute(){
        console.log("ERROR: comando desconocido");
    }
}

//anto
/*
class ComandoAgregarPlayList extends Comando {

    static execute(listaDeParametros) {
        let unaUNQFY = getUNQfy();
        let data = {
            name: listaDeParametros[0],
            genres: listaDeParametros[1],
            duracion: listaDeParametros[2]
        }
        try {
            unaUNQFY.addPlayList(data);
            super.comandoEjecutadoConExito(unaUNQFY)
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}
*/
//antofin

class ComandoAgregarArtista extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let data= {
            name: listaDeParametros[0],
            bornDate: listaDeParametros[1], 
            country: listaDeParametros[2]
        }
            unaUNQFY.addArtist(data);
            super.comandoEjecutadoConExito(unaUNQFY)
    }
}

class ComandoAgregarAlbum extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let data = {
            name: listaDeParametros[0],
            year: listaDeParametros[1],
        }
        try{
            unaUNQFY.addAlbum(parseInt(listaDeParametros[2]), data);
            super.comandoEjecutadoConExito(unaUNQFY);
        }catch(error){
            console.log("ERROR: " + error.message);
        }
    }
}

class ComandoAgregarTrack extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let data = {
            name: listaDeParametros[0],
            duration: listaDeParametros[1],
            genres: listaDeParametros[2].split(" ")
        }
        try{
            unaUNQFY.addTrack(parseInt(listaDeParametros[3]), data);
            super.comandoEjecutadoConExito(unaUNQFY);
        }catch(error){
            console.log("ERROR: " + error.message);
        }
    }
}

//anto
/*
class ComandoEliminarPlayList extends Comando {

    static execute(listaDeParametros) {
        let unaUNQFY = getUNQfy();
        try {
            unaUNQFY.eliminarPlayList(parseInt(listaDeParametros[0]));
            super.comandoEjecutadoConExito(unaUNQFY);
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}
*/

class ComandoEliminarArtista extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try{
            unaUNQFY.eliminarArtista(parseInt(listaDeParametros[0]));
            super.comandoEjecutadoConExito(unaUNQFY);
        }catch(error){
            console.log("ERROR: " + error.message);
        }
    }
}

class ComandoEliminarAlbum extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try{
            unaUNQFY.eliminarAlbum(parseInt(listaDeParametros[0]));
            super.comandoEjecutadoConExito(unaUNQFY);
        }catch(error){
           console.log("ERROR: " + error.message);
        }
    }
}

class ComandoEliminarTrack extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try{
            unaUNQFY.eliminarTrack(parseInt(listaDeParametros[0]));
            super.comandoEjecutadoConExito(unaUNQFY);
        }catch(error){
            console.log("ERROR: " + error.message);
        }
    }
}

/*
class ComandoGetPlayList extends Comando {

    static execute() {
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getplayList();
        console.log(super.mapearListaDePlayList(resultados));
    }
}
*/

class ComandoGetArtistas extends Comando{

    static execute(){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getArtistas();
        console.log(super.mapearListaDeArtistas(resultados));
    }
}

class ComandoGetAlbums extends Comando{

    static execute(){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getAlbums();
        console.log(super.mapearListaDeAlbums(resultados));
    }
}

class ComandoGetTracks extends Comando{

    static execute(){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getTracks();
        console.log(super.mapearListaDeTracks(resultados));
    }
}

class ComandoBuscarPorNombre extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.searchByName(listaDeParametros[0]);
        console.log(this.mapearResultados(resultados));
    }

    static mapearResultados(resultados){
        return {
            artistas: super.mapearListaDeArtistas(resultados.artists),
            albums: super.mapearListaDeAlbums(resultados.albums),
            tracks: super.mapearListaDeTracks(resultados.tracks)
        }
    }
}

class ComandoGetTracksConGeneros extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getTracksMatchingGenres(listaDeParametros[0].split(" "));
        console.log(this.mapearListaDeTracks(resultados));
    }
}

class ComandoGetTracksDeArtista extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getTracksMatchingArtist(listaDeParametros[0]);
        console.log(super.mapearListaDeTracks(resultados));
    }
}

module.exports = {
    ComandoInexistente: ComandoInexistente,
    //-----------------------------------------------
    // ComandoAgregarPlayList : ComandoAgregarPlayList,
    ComandoAgregarArtista: ComandoAgregarArtista,
    ComandoAgregarAlbum: ComandoAgregarAlbum,
    ComandoAgregarTrack: ComandoAgregarTrack,
    //-----------------------------------------------
    //ComandoEliminarPlayList: ComandoEliminarPlayList,
    ComandoEliminarArtista: ComandoEliminarArtista,
    ComandoEliminarAlbum: ComandoEliminarAlbum,
    ComandoEliminarTrack: ComandoEliminarTrack,
    //-----------------------------------------------
   // ComandoGetPlayList: ComandoGetPlayList,
    ComandoGetArtistas: ComandoGetArtistas,
    ComandoGetAlbums: ComandoGetAlbums,
    ComandoGetTracks: ComandoGetTracks,
    //-----------------------------------------------
    ComandoBuscarPorNombre: ComandoBuscarPorNombre,
    ComandoGetTracksConGeneros: ComandoGetTracksConGeneros,
    ComandoGetTracksDeArtista: ComandoGetTracksDeArtista
