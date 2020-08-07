const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const NotificationServiceClient = require('./NotificationServiceClient');
const ServicioExternoAlbumObservator = require('./ServicioExternoAlbumObservator');

function getUNQfy(incluirNotiServiceComoObserver = "true", filename = 'data.json') {
    
    let unqfy;
    if (fs.existsSync(filename)) {
        unqfy = unqmod.UNQfy.load(filename);
    }else{
        if("true" === incluirNotiServiceComoObserver){
            unqfy = new unqmod.UNQfy()
            notificationClient = new NotificationServiceClient();
            observador = new ServicioExternoAlbumObservator(notificationClient);
            unqfy.addNewSubscriber(observador);
        }else{
            unqfy = new unqmod.UNQfy();
        }
    }
    return unqfy;
}
  
function saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
}

class Comando{

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
                let trackLyrics = track.lyrics;
                if(!trackLyrics){trackLyrics = "Todavia no le ha descargado la letra de la track"}

                let trackMappeada = {
                    titulo: track.titulo,
                    duracion: track.duracion + " segs",
                    generos: track.generosMusicales,
                    album: track.albumAlquePertenece.nombre,
                    id: track.id,
                    lyrics: trackLyrics
                }
                resultado.push(trackMappeada);
            });
            return resultado;
        }else{
            return "No existe ninguna track con ese nombre"
        }
    }

    static mapearListaDePlayList(listaDePlayList) {
        if (listaDePlayList.length > 0) {
            let resultado = [];
            listaDePlayList.forEach(playList => {
                let mappedPlayList = {
                    nombre: playList.nombre,
                    id: playList.idPlayList,
                    duracion: playList.duracion,
                    genero: playList.genero.toString(),
                    tracks: playList.tracks.map(track => track.titulo).toString()
                }
                resultado.push(mappedPlayList);
            })
            return resultado;
        } else {
            return "No existe ninguna PlayList con ese nombre"
        }
    }
    
    static comandoEjecutadoConExito(unaUNQFY){
        console.log("Comando ejecutado con exito");
        saveUNQfy(unaUNQFY);
    }
}

class ComandoInexistente extends Comando{

    static execute(){
        console.log("ERROR: comando desconocido");
    }
}

class ComandoAgregarArtista extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        let data= {
            name: listaDeParametros[0],
            bornDate: listaDeParametros[1], 
            country: listaDeParametros[2]
        }
        try{
            unaUNQFY.addArtist(data);
            super.comandoEjecutadoConExito(unaUNQFY)
        }catch(error){
            console.log("ERROR: " + error.message);
        }
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
        let nroRecibido = parseInt(listaDeParametros[1])
        let data = {
            name: listaDeParametros[0],
            duration: nroRecibido,
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

class ComandoCrearPlayList extends Comando {

    static execute(listaDeParametros) {
        let unaUNQFY = getUNQfy();
        try {
            unaUNQFY.createPlaylist(listaDeParametros[0], listaDeParametros[1].split(" "), parseInt(listaDeParametros[2]));
            super.comandoEjecutadoConExito(unaUNQFY)
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}

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

class ComandoEliminarPlayList extends Comando {

    static execute(listaDeParametros) {
        let unaUNQFY = getUNQfy();
        try {
            unaUNQFY.eliminarPlayList((listaDeParametros[0]));
            super.comandoEjecutadoConExito(unaUNQFY);
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}

class ComandoGetArtistas extends Comando{

    static execute(){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getArtistas();
        if(resultados.length === 0){
            console.log("no hay ningun artista registrado en el sistema")
        }else{
            console.log(super.mapearListaDeArtistas(resultados));
        }
    }
}

class ComandoGetAlbums extends Comando{

    static execute(){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getAlbums();
        if(resultados.length ===  0){
            console.log("no hay ningun album registrado en el sistema")
        }else{
            console.log(super.mapearListaDeAlbums(resultados));
        }
    }
}

class ComandoGetTracks extends Comando{

    static execute(){
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getTracks();
        if(resultados.length === 0){
            console.log("no hay ninguna track registrada en el sistema")
        }else{
            console.log(super.mapearListaDeTracks(resultados));
        }
    }
}

class ComandoGetPlayList extends Comando {

    static execute() {
        let unaUNQFY = getUNQfy();
        let resultados = unaUNQFY.getPlayLists();
        console.log(super.mapearListaDePlayList(resultados));
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
            tracks: super.mapearListaDeTracks(resultados.tracks),
            playList: super.mapearListaDePlayList(resultados.playlists)
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

class ComandoPopulateAlbumsForArtist extends Comando{

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();

        unaUNQFY.populateAlbumsForArtist(parseInt(listaDeParametros[0])).then((populatedAlbums) =>{
            if(populatedAlbums.length == 0){
                console.log("No hay albums para popular de este artista");
            }else{
                super.comandoEjecutadoConExito(unaUNQFY);
                console.log("Albums traidos de Spotify:");
                console.log(populatedAlbums);
            }
         }).catch( (error) =>{
            console.log("ERROR: " + error);
         })
    }
}

class ComandoCreateUser extends Comando {
    
    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        unaUNQFY.createUser(listaDeParametros[0], listaDeParametros[1]);
        super.comandoEjecutadoConExito(unaUNQFY);
    }
}

class ComandoListenTrack extends Comando {
    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try {
            unaUNQFY.userListenTrack(parseInt(listaDeParametros[0]), parseInt(listaDeParametros[1]));
            super.comandoEjecutadoConExito(unaUNQFY);
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}

class ComandoListenPlayList extends Comando {

    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try {
            unaUNQFY.userListenPlaylist(parseInt(listaDeParametros[0]), listaDeParametros[1]);
            super.comandoEjecutadoConExito(unaUNQFY);
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}

class ComandoGetUserListenedTracks extends Comando {
    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try {
            let cancionesEscuchadas = unaUNQFY.getUserListenedTracks(parseInt(listaDeParametros[0]));
            console.log(this.mapearListaDeTracks(cancionesEscuchadas));
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}

class ComandoGetTimesTrackWasListenedByUser extends Comando {
    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try {
            let vecesQueEscuchoCancion = unaUNQFY.getTimesTrackWasListenedByUser(parseInt(listaDeParametros[0]), 
                parseInt(listaDeParametros[1]));

            console.log(vecesQueEscuchoCancion);
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }    
}

class ComandoGetTrackTopThreeOfUser extends Comando {
    static execute(listaDeParametros){
        let unaUNQFY = getUNQfy();
        try {
            let listaTop = unaUNQFY.getTrackTopThreeOf(parseInt(listaDeParametros[0]), listaDeParametros[1]);
            console.log(this.mapearListaDeTracks(listaTop));
        } catch (error) {
            console.log("ERROR: " + error.message);
        }
    }
}

module.exports = {
    ComandoInexistente: ComandoInexistente,
    //-----------------------------------------------
    // ComandoAgregarPlayList : ComandoAgregarPlayList,
    ComandoAgregarArtista: ComandoAgregarArtista,
    ComandoAgregarAlbum: ComandoAgregarAlbum,
    ComandoAgregarTrack: ComandoAgregarTrack,
    ComandoCrearPlayList: ComandoCrearPlayList,
    //-----------------------------------------------
    //ComandoEliminarPlayList: ComandoEliminarPlayList,
    ComandoEliminarArtista: ComandoEliminarArtista,
    ComandoEliminarAlbum: ComandoEliminarAlbum,
    ComandoEliminarTrack: ComandoEliminarTrack,
    ComandoEliminarPlayList: ComandoEliminarPlayList,
    //-----------------------------------------------
   // ComandoGetPlayList: ComandoGetPlayList,
    ComandoGetArtistas: ComandoGetArtistas,
    ComandoGetAlbums: ComandoGetAlbums,
    ComandoGetTracks: ComandoGetTracks,
    ComandoGetPlayList: ComandoGetPlayList,
    //-----------------------------------------------
    ComandoBuscarPorNombre: ComandoBuscarPorNombre,
    ComandoGetTracksConGeneros: ComandoGetTracksConGeneros,
    ComandoGetTracksDeArtista: ComandoGetTracksDeArtista,
    //-----------------------------------------------
    ComandoPopulateAlbumsForArtist: ComandoPopulateAlbumsForArtist,
    //-----------------------------------------------
    ComandoCreateUser: ComandoCreateUser,
    ComandoListenTrack: ComandoListenTrack,
    ComandoListenPlayList: ComandoListenPlayList,
    ComandoGetUserListenedTracks: ComandoGetUserListenedTracks,
    ComandoGetTimesTrackWasListenedByUser: ComandoGetTimesTrackWasListenedByUser,
    ComandoGetTrackTopThreeOfUser: ComandoGetTrackTopThreeOfUser,
    //------------------------------------------------
    getUNQfy: getUNQfy,
    saveUNQfy: saveUNQfy
}
