
const picklify = require('picklify');
const fs = require('fs');

const Artista = require('./Artista');
const Album = require('./Album');
const Track = require('./track');
const GeneradorDeClaves = require('./GeneradorDeClaves');
const Buscador = require('./Buscador');
const Errores = require('./Errores');
const PlayList = require('./PlayList');
const Usuario = require('./Usuario');
const SpotifyClient = require('./SpotifyClient');
const MusixMatchClient = require ('./MusixMatchClient');
const ManejadorDeObservadores = require('./ManejadorDeObservadores');
const NotificationServiceClient = require('./NotificationServiceClient');
const ServicioExternoAlbumObservator = require('./ServicioExternoAlbumObservator');
const SucesosEnUNQQfyObservator = require('./SucesosEnUNQfyObservator');
const LoggingServiceClient = require('./LoggingServiceClient');
const { response } = require('express');

class UNQfy {

  constructor(){
    this._generadorDeClaves = new GeneradorDeClaves();
    this._buscador = new Buscador();
    this._spotifyClient = new SpotifyClient();
    this._musixMatchClient = new MusixMatchClient();
    this._manejadorDeObservadores = new ManejadorDeObservadores();

    this._artistas = [];
    this._playList = [];
    this._usuarios  = []; 
  }

  get musixMatchClient(){return this._musixMatchClient;}
  //-----------------------------------------------------------------------------------------------------------------------
  //--AGREGADOS------------------------------------------------------------------------------------------------------------

  addArtist(artistData) {
      if(this._buscador.hayArtistaConData(artistData,this._artistas)){
        throw new Errores.ElementoDuplicado("Artista")
      }else{
        let nuevoID = this._generadorDeClaves.generarClaveDeArtista();
      
        let nuevoArtista = new Artista(artistData.name, artistData.bornDate, this.capitalize(artistData.country), nuevoID)
        this._artistas.push(nuevoArtista);
        
        let jsonOBJ = {
          loggMessage: "Se ha agregado el artista " + artistData.name
        }

        this._manejadorDeObservadores.updateDeAgregadoDeArtista(jsonOBJ);
        return nuevoArtista;
      }
  }

  capitalize(unString){
    let listaDelString = unString.split("");
    let primeraletraEnMayuscula = unString.split("")[0].toUpperCase();
    listaDelString[0] = primeraletraEnMayuscula;
    return listaDelString.join("");
  }

  addAlbum(artistId, albumData) {
    let artistaConID = this._buscador.getArtistaConID(artistId, this._artistas);
    if(artistaConID === undefined){

      throw new Errores.NoExisteElementoConID("artista", artistId);
    }else if(albumData.year > new Date().getFullYear()){

      throw new Errores.FechaInvalida("del album");
    }else{

      let nuevoID = this._generadorDeClaves.generarClaveDeAlbum();
      let nuevoAlbum = new Album(albumData.name, albumData.year, nuevoID, artistaConID);
      artistaConID.agregarAlbum(nuevoAlbum);

      let message = 'Se ha agregado el album ' + albumData.name + ' al artista ' + artistaConID.nombre;
      let jsOBJ = {
        artistaID: artistId,
        nombreDeArtista: artistaConID.nombre,
        nombreDeAlbum: albumData.name,
        loggMessage: message
      }

      this._manejadorDeObservadores.updateDeAgregadoDeAlbum(jsOBJ);
      return nuevoAlbum;
    }
  }

  addTrack(albumId, trackData) {
    let albumConID = this._buscador.getAlbumConID(albumId, this._artistas);
    if(albumConID !== undefined){
      let nuevoID = this._generadorDeClaves.generarClaveDeTrack();
      let nuevoTrack = new Track(trackData.name, trackData.genres, trackData.duration, albumConID, nuevoID);
      albumConID.agregarTrack(nuevoTrack);
      
      let jsonOBJ = {
        loggMessage: "Se ha agregado el track " + trackData.name + " al album " + albumConID.nombre + " del artista " + albumConID.autor.nombre
      };

      this._manejadorDeObservadores.updateDeAgregadoDeTrack(jsonOBJ)
      return nuevoTrack;
    }else{
      throw new Errores.NoExisteElementoConID("album", albumId);
    }
  }

  createPlaylist(name, genresToInclude, maxDuration) {
    if(!this._playList.some(playlist => playlist.nombre === name)){

      let id = this._generadorDeClaves.generarClaveDePlaylist();
      let tracks = this.generarTracksDePlaylistCon(genresToInclude, maxDuration);        
      let duracion = tracks.map(track => track.duracion).reduce( (a, b) => {return a + b}, 0);

      let nuevaPlaylist = new PlayList(name, id, duracion, genresToInclude, tracks);
      this._playList.push(nuevaPlaylist);
      return nuevaPlaylist;
    }else{
      throw new Errores.ElementoExistenteConMismoNombre(name, "una playlist", "el sistema");
    }
  }

  generarTracksDePlaylistCon(listaDeGeneros, maxDuration){
    let tracks = this.getTracksMatchingGenres(listaDeGeneros).sort(() => Math.random() - 0.5);
    /* esta manera de ordenar aleatoriamente un array es recomendable solo para arrays relativamente chicos
     * por eso es aplicada
     */

    return tracks.reduce((tracksAcumuladas, track) => {
      if(tracksAcumuladas.map(track => track.duracion).reduce( (a, b) => {return a + b}, 0) + track.duracion <= maxDuration){
        return tracksAcumuladas.concat([track]);
      }else{
        return tracksAcumuladas;
      }
    }, [])
  }  

  crearPlaylistConTracksConID(nombre, listaDeIDdeTracks){
    if(!this._playList.some(playlist => playlist.nombre === nombre)){
      let listaDeTracks = this.generarListaDeTracksAPartirDeListaDeID(listaDeIDdeTracks);
      let nuevoIDParaPlaylist = this._generadorDeClaves.generarClaveDePlaylist();
      let generos = this.getTodosLosGeneros(listaDeTracks);
      let duracion = listaDeTracks.map(track => track.duracion).reduce((acumulador, actual) => {return acumulador + actual}, 0);

      let nuevaPlaylist = new PlayList(nombre,nuevoIDParaPlaylist, duracion,generos,listaDeTracks);
      this._playList.push(nuevaPlaylist);
      return nuevaPlaylist;
    }else{
      throw new Errores.ElementoExistenteConMismoNombre(nombre, "una playlist", "el sistema");
    }
  }

  generarListaDeTracksAPartirDeListaDeID(listaDeIDdeTracks){
    
    let listaDeTracks = [];
    listaDeIDdeTracks.forEach(id => {
      let trackConID = this._buscador.getTrackConID(id,this._artistas);
        if(trackConID === undefined){
          throw new Errores.NoExisteElementoConID("track", id);
        }else{
          listaDeTracks.push(trackConID);
        }  
    });
    return listaDeTracks;
  }

  getTodosLosGeneros(listaDeTracks){

    let listaDeGenerosConRepetidos = listaDeTracks.map(track => track.generosMusicales).flat();
    return listaDeGenerosConRepetidos.filter(function(genero, pos) {
      return listaDeGenerosConRepetidos.indexOf(genero) == pos;
    })
  }

  //-----------------------------------------------------------------------------------------------------------------------
  //--ELIMINADOS-----------------------------------------------------------------------------------------------------------

  eliminarArtista(artistaID){
    let artistaAEliminar = this._buscador.getArtistaConID(artistaID, this._artistas);
    if(artistaAEliminar !== undefined){
      artistaAEliminar.albums.forEach(album => this.eliminarAlbum(album.id));
      this._artistas = this._artistas.filter(artista => artista.id !== artistaID);

      let jsonOBJ = {
        loggMessage: "Se ha eliminado al artista " + artistaAEliminar.nombre + " y todos sus albums y tracks"
      }

      this._manejadorDeObservadores.updateDeEliminadoDeArtista(jsonOBJ)
    }else{
      throw new Errores.NoExisteElementoConID("artista", artistaID);
    }
  }

  eliminarAlbum(albumID){
    let albumAElminar = this._buscador.getAlbumConID(albumID, this._artistas);
    if(albumAElminar !== undefined){
      albumAElminar.tracks.forEach(track => this.eliminarTrack(track.id));
      let autorDelAlbum = albumAElminar.autor;
      autorDelAlbum.eliminarAlbum(albumAElminar.nombre);

      let jsonOBJ = {
        loggMessage: "Se ha eliminado el album " + albumAElminar.nombre + " y todas sus tracks del artista " + autorDelAlbum.nombre
      }

      this._manejadorDeObservadores.updateDeEliminadoDeAlbum(jsonOBJ);
    }else{
      throw new Errores.NoExisteElementoConID("album", albumID);
    }
  }

  eliminarTrack(trackID){
    let trackAEliminar = this._buscador.getTrackConID(trackID, this._artistas);
    if(trackAEliminar !== undefined){
      let albumDeLaTrack = trackAEliminar.albumAlquePertenece;
      albumDeLaTrack.eliminarTrack(trackAEliminar.titulo);

      this._playList.forEach(playlist => playlist.eliminarTrack(trackID));

      let jsonOBJ = {
        loggMessage: "Se ha eliminado la track " + trackAEliminar.titulo + " del album " + albumDeLaTrack.nombre + " del artista " + albumDeLaTrack.autor.nombre
      }

      this._manejadorDeObservadores.updateDeEliminadoDeTrack(jsonOBJ)
    }else{
      throw new Errores.NoExisteElementoConID("track", trackID);
    }
  }

  eliminarPlayList(nombreDePlayList){
    let playListAEliminar = this._buscador.getPlaylistConNombre(nombreDePlayList, this._playList)[0];
    if(playListAEliminar === undefined){
      throw new Errores.NoExisteElementoConID("playlist", nombreDePlayList);
    }else{
      this._playList = this._playList.filter(playList => playList.nombre !== nombreDePlayList);
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------
  //--BUSQUEDAS------------------------------------------------------------------------------------------------------------

  getArtistas(){
    return this._artistas;
  }
  //refactor en todos los getXConID
  getArtistaConID(unID){
    let artista = this._buscador.getArtistaConID(unID, this._artistas);
    if(artista === undefined){
      throw new Errores.NoExisteElementoConID("Artista", unID);
    }else{
      return artista;
    }
  }

  getAlbums(){
    return this._buscador.getAlbumsDelSistema(this._artistas);
  }

  getAlbumConID(unID){
    let album = this._buscador.getAlbumConID(unID, this._artistas);
    if (album === undefined){
      throw new Errores.NoExisteElementoConID("Album", unID);
    }else{
      return album;
    }
  }

  getTracks(){
    return this._buscador.getTracksDelSistema(this._artistas);
  }

  getTrackConID(unID){
    let track = this._buscador.getTrackConID(unID,this._artistas);
    if (track === undefined){
      throw new Errores.NoExisteElementoConID("Track", unID)
    }else{
      return track;
    }
  }

  getPlayLists(){
    return this._playList;
  }

  getPlayListConID(unID){
    let playlist = this._buscador.getPlayListConID(unID, this._playList);
    if (playlist === undefined){
      throw new Errores.NoExisteElementoConID("PlayList", unID)
    }else{
      return playlist;
    }
  }

  searchByName(aName){
    let dictionary = {
      artists: this._buscador.getArtistasConNombre(aName, this._artistas),
      albums: this._buscador.getAlbumsConNombre(aName, this._artistas),
      tracks: this._buscador.getTracksConTitulo(aName, this._artistas),
      playlists: this._buscador.getPlaylistConNombre(aName, this._playList)
    }
    return dictionary;
  }

  getTracksMatchingGenres(genres) {
    return this._buscador.getTracksConGeneros(genres, this._artistas);
  }

  getTracksMatchingArtist(artistName) {
    return this._buscador.getTracksDeArtistaConNombre(artistName, this._artistas);
  }
  
  //-----------------------------------------------------------------------------------------------------------------------
  //--RELACIONADO A USUARIOS-----------------------------------------------------------------------------------------------

  createUser(userName, userAge){

    let newID = this._generadorDeClaves.generarClaveDeUsuario();
    let newUser = new Usuario(newID, userName, userAge);

    this._usuarios.push(newUser);

    return newUser;
  }

  userListenTrack(userID, trackID){

    let usuarioConID = this._buscador.getUserConID(userID, this._usuarios);
    let trackConID = this._buscador.getTrackConID(trackID,this._artistas);

    if(usuarioConID === undefined){throw new Errores.NoExisteElementoConID("Usuario", userID);}
    if(trackConID === undefined){throw new Errores.NoExisteElementoConID("Track", trackID);}
    
    usuarioConID.escucharTrack(trackConID);
  }

  userListenPlaylist(userID, playlistNombre){
    let usuarioConID = this._buscador.getUserConID(userID, this._usuarios);
    let playlistConNombre = this._buscador.getPlaylistConNombre(playlistNombre, this._playList)[0];

    if(usuarioConID === undefined){throw new Errores.NoExisteElementoConID("Usuario", userID);}
    if(playlistConNombre === undefined){throw new Errores.NoExisteElementoConID("Playlist", playlistNombre);}
    
    usuarioConID.escucharPlaylist(playlistConNombre);
  }

  getUserListenedTracks(userID){
    let usuarioConID = this._buscador.getUserConID(userID, this._usuarios);

    if(usuarioConID === undefined){throw new Errores.NoExisteElementoConID("Usuario", userID);}

    return usuarioConID.getTemasEscuchados();
  }

  getTimesTrackWasListenedByUser(userID, trackID){
    let usuarioConID = this._buscador.getUserConID(userID, this._usuarios);
    let trackConID = this._buscador.getTrackConID(trackID,this._artistas);

    if(usuarioConID === undefined){throw new Errores.NoExisteElementoConID("Usuario", userID);}
    if(trackConID === undefined){throw new Errores.NoExisteElementoConID("Track", trackID);}

    return usuarioConID.getVecesQueEscuchoTema(trackConID);
  }

  getTrackTopThreeOf(userID, artistName){
    let usuarioConID = this._buscador.getUserConID(userID, this._usuarios);

    if(usuarioConID === undefined){throw new Errores.NoExisteElementoConID("Usuario", userID);}

    return usuarioConID.getTracksMasEscuchadosDe(artistName);
  }

  //-----------------------------------------------------------------------------------------------------------------------
  //--ACCIONES QUE CONSUMEN DE OTRAS API'S---------------------------------------------------------------------------------

  populateAlbumsForArtist(unIDdeArtista){
    let artista = this._buscador.getArtistaConID(unIDdeArtista, this._artistas);

    if(artista === undefined){
      return Promise.reject(new Errores.NoExisteElementoConID("Artista", unIDdeArtista));
    }else{
      
      return this.populate(artista);
    }
  }

  populate(unArtista){
    return this._spotifyClient.getArtistAlbums(unArtista.nombre).then((response)=> {
      let populatedAlbums = [];

      response.items.reduce( (lista, album) => {
        if(this._buscador.albumIsInList(lista,album) || !unArtista.noHayAlbumConElMismoNombre(album.name)){
          return lista;
        }else{
          return lista.concat([album]);
        }
      }, []).forEach(album => {

        let data = {
          name: album.name, 
          year: album.release_date.split('-')[0]
        }

        populatedAlbums.push(data);
        this.addAlbum(unArtista.id, data);
      });
      return populatedAlbums;
    })
  }

  getTrackLyrics(trackID){
    let track = this._buscador.getTrackConID(trackID,this._artistas);
    if(track === undefined){
      return Promise.reject(new Errores.NoExisteElementoConID("Track", trackID));
    }else{
      return track.getLyrics(this._musixMatchClient); 
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------
  //--OBSERVADORES---------------------------------------------------------------------------------------------------------

  addNewSubscriber(nuevoSus){
    this._manejadorDeObservadores.agregarObservador(nuevoSus);
  }

  //-----------------------------------------------------------------------------------------------------------------------
  //--PERSISTIR------------------------------------------------------------------------------------------------------------

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];
    const serializedData = picklify.picklify(this);
    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Map, NotificationServiceClient, ManejadorDeObservadores, Buscador, GeneradorDeClaves, MusixMatchClient,
      SpotifyClient, Artista, Album, Track, PlayList, Usuario, ServicioExternoAlbumObservator, LoggingServiceClient, SucesosEnUNQQfyObservator
    ];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }

}

module.exports = {
  UNQfy
};