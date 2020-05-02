
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
  addArtist(artistData) {
    if(this._database.noHayArtistaConElMismoNombre(artistData.name)){
      let nuevoID = this._generadorDeClaves.generarClaveDeArtista();
      let nuevoArtista = new Artista(artistData.name, artistData.bornDate, artistData.country, nuevoID)
      this._database.agregarArtista(nuevoArtista);
      return nuevoArtista;
    }else{
      throw new Errores.ElementoExisteneConMismoNombre(artistData.name, "un artista", "UNQfy"); 
    }
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    let artistaConID = this._buscador.getArtistaConID(artistId, this._database.artistas);
    if(artistaConID !== undefined){
      let nuevoID = this._generadorDeClaves.generarClaveDeAlbum();
      let nuevoAlbum = new Album(albumData.name, albumData.year, nuevoID, artistaConID);
      artistaConID.agregarAlbum(nuevoAlbum);
      return nuevoAlbum;
    }else{
      throw new Errores.NoExisteElementoConID("artista", artistId);
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

  getArtistById(id) {
    return this._buscador.getArtistaConID(id, this._database.artistas);
  }

  getAlbumById(id) {
    return this._buscador.getAlbumConID(id, this._database.artistas);
  }

  getTrackById(id) {
    return this._buscador.getTrackConID(id, this._database.artistas);
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
    const classes = [UNQfy];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

