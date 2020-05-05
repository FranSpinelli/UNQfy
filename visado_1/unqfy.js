
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

const Artista = require('./Artista');
const Album = require('./Album');
const Track = require('./track');
const Database = require('./Database');
const GeneradorDeClaves = require('./GeneradorDeClaves');
const Buscador = require('./Buscador');
const Errores = require('./Errores');


class UNQfy {

  constructor(){
    this._database = new Database();
    this._generadorDeClaves = new GeneradorDeClaves();
    this._buscador = new Buscador();
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  capitalize(unString){
    let listaDelString = unString.split("");
    let primeraletraEnMayuscula = unString.split("")[0].toUpperCase();
    listaDelString[0] = primeraletraEnMayuscula;
    return listaDelString.join("");
  }

  addArtist(artistData) {
    
      let nuevoID = this._generadorDeClaves.generarClaveDeArtista();

      /*let primeraLetraEnMayuscula = artistData.country.split("")[0].toUpperCase();
      let paisConMayuscula = artistData.country.split("");
      paisConMayuscula[0] = primeraLetraEnMayuscula;*/
      
      let nuevoArtista = new Artista(artistData.name, artistData.bornDate, this.capitalize(artistData.country), nuevoID)
      this._database.agregarArtista(nuevoArtista);
      return nuevoArtista;
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    let artistaConID = this._buscador.getArtistaConID(artistId, this._database.artistas);
    if(artistaConID !== undefined && albumData.year < new Date().getFullYear()){
      let nuevoID = this._generadorDeClaves.generarClaveDeAlbum();
      let nuevoAlbum = new Album(albumData.name, albumData.year, nuevoID, artistaConID);
      artistaConID.agregarAlbum(nuevoAlbum);
      return nuevoAlbum;
    }else{
      if(artistaConID == undefined){
        throw new Errores.NoExisteElementoConID("artista", artistId);
      }else{
        throw new Errores.FechaInvalida("del album");
      }
    }
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    let albumConID = this._buscador.getAlbumConID(albumId, this._database.artistas);
    if(albumConID !== undefined){
      let nuevoID = this._generadorDeClaves.generarClaveDeTrack();
      let nuevoTrack = new Track(trackData.name, trackData.genres, trackData.duration, albumConID, nuevoID);
      albumConID.agregarTrack(nuevoTrack);
      return nuevoTrack;
    }else{
      throw new Errores.NoExisteElementoConID("album", albumId);
    }
  }

  eliminarArtista(artistaID){
    let artistaAEliminar = this._buscador.getArtistaConID(artistaID, this._database.artistas);
    if(artistaAEliminar !== undefined){
      artistaAEliminar.albums.forEach(album => this.eliminarAlbum(album.id));
      this._database.eliminarArtista(artistaAEliminar.nombre);
    }else{
      throw new Errores.NoExisteElementoConID("artista", artistaID);
    }
  }
  eliminarAlbum(albumID){
    let albumAElminar = this._buscador.getAlbumConID(albumID, this._database.artistas);
    if(albumAElminar !== undefined){
      albumAElminar.tracks.forEach(track => this.eliminarTrack(track.id));
      let autorDelAlbum = albumAElminar.autor;
      autorDelAlbum.eliminarAlbum(albumAElminar.nombre);
    }else{
      throw new Errores.NoExisteElementoConID("album", albumID);
    }
  }
  eliminarTrack(trackID){
    let trackAEliminar = this._buscador.getTrackConID(trackID, this._database.artistas);
    if(trackAEliminar !== undefined){
      let albumDeLaTrack = trackAEliminar.albumAlquePertenece;
      albumDeLaTrack.eliminarTrack(trackAEliminar.titulo);

      //Lo que sigue es sacar de todas las playlist esa track

    }else{
      throw new Errores.NoExisteElementoConID("track", trackID);
    }
  }

  getArtistas(){
    return this._database.artistas;
  }

  getAlbums(){
    return this._buscador.getAlbumsDelSistema(this._database.artistas);
  }

  getTracks(){
    return this._buscador.getTracksDelSistema(this._database.artistas);
  }

  getPlaylistById(id) {

  }

  searchByName(aName){
    let dictionary = {
      artists: this._buscador.getArtistasConNombre(aName, this._database.artistas),
      albums: this._buscador.getAlbumsConNombre(aName, this._database.artistas),
      tracks: this._buscador.getTracksConTitulo(aName, this._database.artistas),
      //playlists: , agregar metodo correspondiente
    }
    return dictionary;
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    let resultadoFinal = [];
    genres.forEach(genero => {
      resultadoFinal = resultadoFinal.concat(this._buscador.getTracksDelGenero(genero, this._database.artistas));
    });
    return [...new Set(resultadoFinal)];
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    return this._buscador.getTracksDeArtistaConNombre(artistName, this._database.artistas);
  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

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
    const classes = [UNQfy, Buscador, Database, GeneradorDeClaves, Artista, Album, Track];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy
};

