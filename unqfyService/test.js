/* eslint-env node, mocha */

const assert = require('chai').assert;
const libunqfy = require('./unqfy');
const Track = require('./track');
const Album = require('./Album');
const Artista = require('./Artista');
const Buscador = require('./Buscador');
const GeneradorDeClaves = require('./GeneradorDeClaves');
const Usuario = require('./Usuario');
const Playlist = require('./PlayList');
const Errores = require('./Errores');
const SpotifyClient = require('./SpotifyClient');
const MusixMatchClient = require('./MusixMatchClient');
const ManejadorDeObservadores = require('./ManejadorDeObservadores');
const ServicioExternoAlbumObservator = require("./ServicioExternoAlbumObservator");
const spotifyCreds = require('./spotifyCreds.json');
const fs = require('fs');
const sinon = require('sinon');
const { stub } = require('sinon');

function createAndAddArtist(unqfy, artistName, country) {

  const artist = unqfy.addArtist({ name: artistName, country: country, bornDate: 2015});
  return artist;
}

function createAndAddAlbum(unqfy, artistId, albumName, albumYear) {
  return unqfy.addAlbum(artistId, { name: albumName, year: albumYear });
}

function createAndAddTrack(unqfy, albumName, trackName, trackDuraction, trackGenres) {
  return unqfy.addTrack(albumName, { name: trackName, duration: trackDuraction, genres: trackGenres });
}


describe('Add, remove and filter data', function() {
  let unqfy = null;
  let user;
  this.timeout(10000);

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
    user = unqfy.createUser("pepe",21);
  });

  it('should add an artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');

    assert.equal(artist.nombre, 'Guns n\' Roses');
    assert.equal(artist.pais, 'USA');

  });

  it('should add an album to an artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);

    assert.equal(album.nombre, 'Appetite for Destruction');
    assert.equal(album.añoDeLanzamiento, 1987);
  });

  it('should add a track to an album', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
    const track = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);

    assert.equal(track.titulo, 'Welcome to the jungle');
    assert.strictEqual(track.duracion, 200);
    assert.equal(track.generosMusicales.includes('rock'), true);
    assert.equal(track.generosMusicales.includes('hard rock'), true);
    assert.lengthOf(track.generosMusicales, 2);
  });

  it('should find different things by name', () => {
    const artist1 = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album1 = createAndAddAlbum(unqfy, artist1.id, 'Roses Album', 1987);
    const track = createAndAddTrack(unqfy, album1.id, 'Roses track', 200, ['pop', 'movie']);
    const playlist = unqfy.createPlaylist('Roses playlist', ['pop'], 1400);

    const results = unqfy.searchByName('Roses');
    assert.deepEqual(results, {
      artists: [artist1],
      albums: [album1],
      tracks: [track],
      playlists: [playlist],
    });

  })

  it('unqfy puede generarUnaListaDeTracks a partir de una lista de ids ', () => {
    const artist1 =createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album1 = createAndAddAlbum(unqfy, artist1.id, 'Roses Album', 1987);
    const track1 = createAndAddTrack(unqfy, album1.id, 'track1', 200, ['pop', 'movie']);
    const track2 = createAndAddTrack(unqfy, album1.id, 'track2', 200, ['pop', 'movie']);
    const track3 = createAndAddTrack(unqfy, album1.id, 'track3', 200, ['pop', 'movie']);
    const listaDeID = [track1.id, track2.id, track3.id];

    const listaDeTracks = unqfy.generarListaDeTracksAPartirDeListaDeID(listaDeID);

    assert.isTrue(listaDeTracks.some(track => track.id === track1.id));
    assert.isTrue(listaDeTracks.some(track => track.id === track2.id));
    assert.isTrue(listaDeTracks.some(track => track.id === track3.id));
  })

  it('unqfy puede darte todos los generos sin repetidos de una lista de tracks', () => {
    const artist1 =createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album1 = createAndAddAlbum(unqfy, artist1.id, 'Roses Album', 1987);
    const track1 = createAndAddTrack(unqfy, album1.id, 'track1', 200, ['pop', 'movie']);
    const track2 = createAndAddTrack(unqfy, album1.id, 'track2', 200, ['pop', 'rock']);
    const track3 = createAndAddTrack(unqfy, album1.id, 'track3', 200, ['pop', 'movie', 'rock', 'disco']);

    const listaDeTracks = [track1, track3, track2];

    const listaDeGeneros = unqfy.getTodosLosGeneros(listaDeTracks);

    assert.equal(listaDeGeneros.length, 4);
  })

  it('unqfy puede crear una playlist a partir de un nombre de playlist y una lista de id de track', () => {
    const artist1 =createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album1 = createAndAddAlbum(unqfy, artist1.id, 'Roses Album', 1987);
    const track1 = createAndAddTrack(unqfy, album1.id, 'track1', 200, ['pop', 'movie']);
    const track2 = createAndAddTrack(unqfy, album1.id, 'track2', 200, ['pop', 'rock']);
    const track3 = createAndAddTrack(unqfy, album1.id, 'track3', 200, ['pop', 'movie', 'rock', 'disco']);

    const playListCreada = unqfy.crearPlaylistConTracksConID('miPlay', [1,2,3]);

    assert.equal(playListCreada.nombre, 'miPlay');
    assert.equal(playListCreada.duracion, 600);
    assert.equal(playListCreada.genero.length, 4);
    assert.equal(playListCreada.tracks.length, 3);
  })
  
  it(' unqfy levanta error si le pido crear una playlist a partir de una lista de id y en la lista hay un id no registrado', () => {
      
    assert.throws( () => {
      const artist1 =createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album1 = createAndAddAlbum(unqfy, artist1.id, 'Roses Album', 1987);
      const track1 = createAndAddTrack(unqfy, album1.id, 'track1', 200, ['pop', 'movie']);
      const track2 = createAndAddTrack(unqfy, album1.id, 'track2', 200, ['pop', 'rock']);
      unqfy.generarListaDeTracksAPartirDeListaDeID([1,2,3]);
    }, 
    Errores.NoExisteElementoConID, 
    "No existe track con ID: 3")
  })

  it('si se quiere agregar un album a un artista que no existe, levanta error', () => {
      
    assert.throws( () => {createAndAddAlbum(unqfy, 2, 'Roses Album', 1987);}, Errores.NoExisteElementoConID, 
      "No existe artista con ID: 2")
  })

  it('si se quiere agregar una Track a un album que no existe, levanta error', () => {
      
    assert.throws( () => {createAndAddTrack(unqfy, 2, 'Roses Album', 1987);}, Errores.NoExisteElementoConID, 
      "No existe album con ID: 2")
  })

  it('should get all tracks matching genres', () => {
    const artist1 = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album1 = createAndAddAlbum(unqfy, artist1.id, 'Appetite for Destruction', 1987);
    const t0 = createAndAddTrack(unqfy, album1.id, 'Welcome to the jungle', 200, ['rock', 'hard rock', 'movie']);
    const t1 = createAndAddTrack(unqfy, album1.id, 'Sweet Child o\' Mine', 500, ['rock', 'hard rock', 'pop', 'movie']);

    const artist2 = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    const album2 = createAndAddAlbum(unqfy, artist2.id, 'Thriller', 1987);
    const t2 = createAndAddTrack(unqfy, album2.id, 'Trhiller', 200, ['pop', 'movie']);
    createAndAddTrack(unqfy, album2.id, 'Another song', 500, ['classic']);
    const t3 = createAndAddTrack(unqfy, album2.id, 'Another song II', 500, ['movie']);

    const tracksMatching = unqfy.getTracksMatchingGenres(['pop', 'movie']);

    // assert.equal(tracks.matching.constructor.name, Array);
    assert.isArray(tracksMatching);
    assert.lengthOf(tracksMatching, 4);
    assert.equal(tracksMatching.includes(t0), true);
    assert.equal(tracksMatching.includes(t1), true);
    assert.equal(tracksMatching.includes(t2), true);
    assert.equal(tracksMatching.includes(t3), true);
  });

  it('should get all tracks matching artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);
    const t2 = createAndAddTrack(unqfy, album.id, 'It\'s so easy', 200, ['rock', 'hard rock']);

    const album2 = createAndAddAlbum(unqfy, artist.id, 'Use Your Illusion I', 1992);
    const t3 = createAndAddTrack(unqfy, album2.id, 'Don\'t Cry', 500, ['rock', 'hard rock']);

    const artist2 = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    const album3 = createAndAddAlbum(unqfy, artist2.id, 'Thriller', 1987);
    createAndAddTrack(unqfy, album3.id, 'Thriller', 200, ['pop', 'movie']);
    createAndAddTrack(unqfy, album3.id, 'Another song', 500, ['classic']);
    createAndAddTrack(unqfy, album3.id, 'Another song II', 500, ['movie']);

    const matchingTracks = unqfy.getTracksMatchingArtist(artist.nombre);
    //antes recibia un artista, pero nosotros lo implementamos haciendo q unqfy reciba el nombre del artista de una

    assert.isArray(matchingTracks);
    assert.lengthOf(matchingTracks, 3);
    assert.isTrue(matchingTracks.includes(t1));
    assert.isTrue(matchingTracks.includes(t2));
    assert.isTrue(matchingTracks.includes(t3));
  });

  it('test unqfy populateAlbumsForArtist(artistID)', function() {
    let data = {
      name: 'Luis Fonsi',
      bornDate: 1998,
      country: 'Colombia'
    }
    unqfy.addArtist(data);
    assert.equal(unqfy.getArtistas()[0].albums.length, 0)

    
    return unqfy.populateAlbumsForArtist(1).then((respuesta) => {
      
      assert.equal(unqfy.getArtistas()[0].albums.length,15);
      assert.equal(respuesta.length, 15);
    })
  })

  it('test unqfy populateAlbumsForArtist(artistID) caso de error', function(){

    return unqfy.populateAlbumsForArtist(1998).catch((error) => {

      assert.equal(error.message, "No existe Artista con ID: 1998")
    })
  })

  it('test unqfy getTrackLyrics(trackID)', function() {
    const artist = createAndAddArtist(unqfy, 'Luis Fonsi', 'Puerto Rico');
    const album = createAndAddAlbum(unqfy, artist.id, 'VIDA', 200);
    const t1 = createAndAddTrack(unqfy, album.id, 'Despacito', 200, ['hit']);

    assert.isTrue(artist.id === 1);
    assert.isTrue(album.id === 1);
    assert.isTrue(t1.id === 1);

    return unqfy.getTrackLyrics(1).then((respuesta) => {
      
      assert.equal(respuesta, "Comin' over in my direction\nSo thankful for that, it's such a blessin', yeah\nTurn every situation into heaven, yeah\n\nOh-oh, you are my sunrise on the darkest day\nGot me feelin' some kind of way\nMake me wanna savor every moment slowly, slowly\n\nYou fit me tailor-made, love how you put it on\nGot the only key, know how to turn it on\nThe way you nibble on my ear, the only words I wanna hear\nBaby, take it slow so we can last long (oh)\n\nTú, tú eres el imán y yo soy el metal\nMe voy acercando y voy armando el plan\nSólo con pensarlo se acelera el pulso (oh, yeah)\n\nYa, ya me estás gustando más de lo normal\nTodos mis sentidos van pidiendo más\nEsto hay que tomarlo sin ningún apuro\n\nDespacito\nQuiero respirar tu cuello despacito\nDeja que te diga cosas al oído\nPara que te acuerdes si no estás conmigo\n\nDespacito\nQuiero desnudarte a besos despacito\nFirmar las paredes de tu laberinto\nY hacer de tu cuerpo todo un manuscrito (sube, sube, sube)\nSube, sube (oh)\n...\n\n******* This Lyrics is NOT for Commercial use *******\n(1409620049094)");
    })
  })

  it('test unqfy getTrackLyrics(trackID) caso de error', function(){

    return unqfy.getTrackLyrics(200).catch((error) => {

      assert.equal(error.message, "No existe Track con ID: 200")
    })
  })

  it('unqfy sabe crear nuevos usuarios', () => {

    let newUser = unqfy.createUser("fran", 20);

    assert.equal(newUser.nombre, "fran");
    assert.equal(newUser.edad, 20);
  })

  it('unqfy le puede decir a un usuario que escuche una track', () => {

    createAndAddArtist(unqfy, "lolero", "argentina");
    createAndAddAlbum(unqfy, 1, "albumDeLolero", 2000);
    createAndAddTrack(unqfy, 1, "lolTrack", 100, ["lola"]);

    assert.equal(unqfy.getUserListenedTracks(1).length, 0);
    unqfy.userListenTrack(1,1);
    assert.equal(unqfy.getUserListenedTracks(1).length, 1);
  })

  it('unqfy le puede decir a un usuario que escuche una playlist', () => {
    createAndAddArtist(unqfy, "lolero", "argentina");
    createAndAddAlbum(unqfy, 1, "albumDeLolero", 2000);
    createAndAddTrack(unqfy, 1, "lolTrack", 100, ["lola"]);
    createAndAddTrack(unqfy, 1, "lolTrack2", 100, ["lola"]);
    createAndAddTrack(unqfy, 1, "lolTrack3", 100, ["lola"]);
    unqfy.createPlaylist('my playlist', ["lola"], 300);
    
    assert.equal(unqfy.getUserListenedTracks(1).length, 0);
    unqfy.userListenPlaylist(1,'my playlist');
    assert.equal(unqfy.getUserListenedTracks(1).length, 3);
  })

  it('unqfy le puede pedir la cantidad de veces que un usuario escucho un tema', () => {
    createAndAddArtist(unqfy, "lolero", "argentina");
    createAndAddAlbum(unqfy, 1, "albumDeLolero", 2000);
    createAndAddTrack(unqfy, 1, "lolTrack", 100, ["lola"]);

    assert.equal(unqfy.getTimesTrackWasListenedByUser(1,1), 0);
    unqfy.userListenTrack(1,1);
    assert.equal(unqfy.getTimesTrackWasListenedByUser(1,1), 1);
    unqfy.userListenTrack(1,1);
    assert.equal(unqfy.getTimesTrackWasListenedByUser(1,1), 2);
  })

  it('unqfy le puede pedir el top 3 de temas escuchados por un usuario', () => {
    createAndAddArtist(unqfy, "lolero", "argentina");
    createAndAddAlbum(unqfy, 1, "albumDeLolero", 2000);
    createAndAddTrack(unqfy, 1, "lolTrack", 100, ["lola"]);
    createAndAddTrack(unqfy, 1, "lolTrack2", 100, ["lola"]);
    createAndAddTrack(unqfy, 1, "lolTrack3", 100, ["lola"]);
    createAndAddTrack(unqfy, 1, "lolTrack4", 100, ["lola"]);

    unqfy.userListenTrack(1,1);
    unqfy.userListenTrack(1,1);
    unqfy.userListenTrack(1,1);

    unqfy.userListenTrack(1,2);
    unqfy.userListenTrack(1,2);
    
    unqfy.userListenTrack(1,3);

    assert.equal(unqfy.getTrackTopThreeOf(1,"lolero")[0].titulo, "lolTrack");
    assert.equal(unqfy.getTrackTopThreeOf(1,"lolero")[1].titulo, "lolTrack2");
    assert.equal(unqfy.getTrackTopThreeOf(1,"lolero")[2].titulo, "lolTrack3");
  })
});

describe('Playlist Creation and properties', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
  });

  it('should create a playlist as requested', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock', 'movie']);
    createAndAddTrack(unqfy, album.id, 'Sweet Child o\' Mine', 1500, ['rock', 'hard rock', 'pop', 'movie']);

    const artist2 = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    const album2 = createAndAddAlbum(unqfy, artist2.id, 'Thriller', 1987);
    const t2 = createAndAddTrack(unqfy, album2.id, 'Thriller', 200, ['pop', 'movie']);
    const t3 = createAndAddTrack(unqfy, album2.id, 'Another song', 500, ['pop']);
    const t4 = createAndAddTrack(unqfy, album2.id, 'Another song II', 500, ['pop']);

    const playlist = unqfy.createPlaylist('my playlist', ['pop', 'rock'], 1400);

    assert.equal(playlist.nombre, 'my playlist');
    
    
    
    assert.isAtMost(playlist.duracion, 1400);
  });
});

describe('Track tests', function() {
  this.timeout(10000);
  let album;
  let track;
  let musixMatchClient;

  beforeEach(() => {
    album = new Album("unNombre", 1978)
    track = new Track("unTitulo", ["genero1", "genero2"], 100, album, 1);
    musixMatchClient = new MusixMatchClient();
  })

  it('chequeo de constructor y getters', () => {
     
    assert.equal(track.titulo, "unTitulo");
    assert.equal(track.generosMusicales[0], "genero1");
    assert.equal(track.generosMusicales[1], "genero2");
    assert.equal(track.duracion, 100);
    assert.equal(track.albumAlquePertenece.nombre, "unNombre");
    assert.equal(track.id, 1);
  })

  it('una track sabe darte su letra a pesar de que no la tenga seteada',function() {
    let autor = new Artista("Luis Fonsi", 1234, "Colombia", 1);
    let album1 = new Album("lol", 2010, 1, autor);
    let despacito = new Track("Despacito", ['1','2'], 20, album1, 1);

    return despacito.getLyrics(musixMatchClient).then( (respuesta) =>{

      assert.equal(respuesta, "Comin' over in my direction\nSo thankful for that, it's such a blessin', yeah\nTurn every situation into heaven, yeah\n\nOh-oh, you are my sunrise on the darkest day\nGot me feelin' some kind of way\nMake me wanna savor every moment slowly, slowly\n\nYou fit me tailor-made, love how you put it on\nGot the only key, know how to turn it on\nThe way you nibble on my ear, the only words I wanna hear\nBaby, take it slow so we can last long (oh)\n\nTú, tú eres el imán y yo soy el metal\nMe voy acercando y voy armando el plan\nSólo con pensarlo se acelera el pulso (oh, yeah)\n\nYa, ya me estás gustando más de lo normal\nTodos mis sentidos van pidiendo más\nEsto hay que tomarlo sin ningún apuro\n\nDespacito\nQuiero respirar tu cuello despacito\nDeja que te diga cosas al oído\nPara que te acuerdes si no estás conmigo\n\nDespacito\nQuiero desnudarte a besos despacito\nFirmar las paredes de tu laberinto\nY hacer de tu cuerpo todo un manuscrito (sube, sube, sube)\nSube, sube (oh)\n...\n\n******* This Lyrics is NOT for Commercial use *******\n(1409620049094)")
    })
  })
});

describe('Album tests', () => {
  let album = null;
  let track1 = null;
  let track2 = null;
  let artista = null;

  beforeEach(() => {
    artista = new Artista("unNombre", 1968,0);
    album = new Album("unNombre", 1978,0, artista)
    track1 = new Track("unTitulo", ["genero1", "genero2"], 100, album,0);
    track2 = new Track("otroTitulo", ["genero3", "genero4"], 200, album,1);
  })

  it('chequeo de constructor y getters', () => {
    
    assert.equal(album.nombre, "unNombre");
    assert.equal(album.añoDeLanzamiento, 1978);
    assert.equal(album.tracks.length, 0);
    assert.equal(album.id, 0);
    assert.equal(album.autor.nombre, "unNombre")
  })
  
  it('un album no tiene tracks repetidos', () => {
    
    album.agregarTrack(track1);
    assert.equal(album.tracks.length, 1);

    assert.throws(() => {album.agregarTrack(track1)}, Errores.ElementoExistenteConMismoNombre, 
      "Ya existe una track con nombre: unTitulo en: este album");
  
  })

  it('un album no tiene 2 tracks con mismo nombre', () => {
    const track3 = new Track("unTitulo", ["genero5", "genero6"], 300, album,2);

    album.agregarTrack(track1);
    assert.equal(album.tracks.length, 1);

    assert.throws(() => {album.agregarTrack(track3)}, Errores.ElementoExistenteConMismoNombre, 
      "Ya existe una track con nombre: unTitulo en: este album");
  
  })

  it('un album puede eliminar tracks', () => {
    
    album.agregarTrack(track1);
    assert.equal(album.tracks.length, 1);
    album.eliminarTrack("unTitulo1");
    assert.equal(album.tracks.length, 1);
    album.eliminarTrack("unTitulo");
    assert.equal(album.tracks.length, 0);
  })

})

describe('Artist tests', () => {
  let album = null;
  let artista = null;

  beforeEach(() => {
    artista = new Artista("unNombre", 1968, "Argentina",0);
    album = new Album("unNombre", 1978,0, artista);
    album2 = new Album("otroNombre", 1978,1, artista);
  })

  it('chequeo de constructor y getters', () => { 
    
    assert.equal(artista.nombre, "unNombre");
    assert.equal(artista.añoDeNacimiento, 1968);
    assert.equal(artista.albums.length, 0);
    assert.equal(artista.id, 0);
  })

  it('un artista lanza error si se quiere agregar 2 albums repetidos', () => {
    
    artista.agregarAlbum(album);
    assert.equal(artista.albums.length, 1);

    assert.throws(() => {artista.agregarAlbum(album)}, Errores.ElementoExistenteConMismoNombre, 
      "Ya existe un album con nombre: unNombre en: este artista");
  })

  it('un artista lanza error si se quiere agregar 2 albums con el mismo nombre', () => {
    const album3 = new Album("unNombre", 1988,2);

    artista.agregarAlbum(album);
    assert.equal(artista.albums.length, 1);

    assert.throws(() => {artista.agregarAlbum(album3)}, Errores.ElementoExistenteConMismoNombre, 
      "Ya existe un album con nombre: unNombre en: este artista");
  })

  it('un artista puede eliminar albums', () => {
    
    artista.agregarAlbum(album);
    assert.equal(artista.albums.length, 1);
    artista.eliminarAlbum("unNombre1");
    assert.equal(artista.albums.length, 1);
    artista.eliminarAlbum("unNombre");
    assert.equal(artista.albums.length, 0);
  })

})

describe('GeneradorDeClaves tests', () => {

    it('un GeneradorDeClaves puede generar id para artistas, albums y tracks', () => {

    const generadorDeClaves= new GeneradorDeClaves();
    claveDeTrack = generadorDeClaves.generarClaveDeTrack();
    claveDeTrack2 = generadorDeClaves.generarClaveDeTrack();
    claveDeAlbum = generadorDeClaves.generarClaveDeAlbum();
    claveDeAlbum2 = generadorDeClaves.generarClaveDeAlbum();
    claveDeArtista = generadorDeClaves.generarClaveDeArtista();
    claveDeArtista2 = generadorDeClaves.generarClaveDeArtista();

    assert.equal(claveDeTrack, 1);
    assert.equal(claveDeTrack2, 2);
    assert.equal(claveDeAlbum, 1);
    assert.equal(claveDeAlbum2, 2);
    assert.equal(claveDeArtista, 1);
    assert.equal(claveDeArtista2, 2);

  })
})

describe ('ApiClients tests', function() {
  let musixMatchClient;
  let spotifyClient;
  this.timeout(10000);

  beforeEach(() => {
    musixMatchClient = new MusixMatchClient();
    spotifyClient = new SpotifyClient();
  })

  it('un MusixMatchClient puede retornar el ID de una Track en MusicxMatch a partir de su nombre y artista', function(){

    return musixMatchClient.getTrackID('Despacito', 'Luis Fonsi').then(response =>{

      assert.equal(response.message.body.track_list[0].track.track_id,152921994);
    })
  })

  it('un MusixMatchClient puede retornar la letra de una Track, de MusicxMatch a partir de su nombre y artista', function(){

    return musixMatchClient.getTrackLyrics('Despacito', 'Luis Fonsi').then(response =>{

      assert.equal(response.message.body.lyrics.lyrics_body, "Comin' over in my direction\nSo thankful for that, it's such a blessin', yeah\nTurn every situation into heaven, yeah\n\nOh-oh, you are my sunrise on the darkest day\nGot me feelin' some kind of way\nMake me wanna savor every moment slowly, slowly\n\nYou fit me tailor-made, love how you put it on\nGot the only key, know how to turn it on\nThe way you nibble on my ear, the only words I wanna hear\nBaby, take it slow so we can last long (oh)\n\nTú, tú eres el imán y yo soy el metal\nMe voy acercando y voy armando el plan\nSólo con pensarlo se acelera el pulso (oh, yeah)\n\nYa, ya me estás gustando más de lo normal\nTodos mis sentidos van pidiendo más\nEsto hay que tomarlo sin ningún apuro\n\nDespacito\nQuiero respirar tu cuello despacito\nDeja que te diga cosas al oído\nPara que te acuerdes si no estás conmigo\n\nDespacito\nQuiero desnudarte a besos despacito\nFirmar las paredes de tu laberinto\nY hacer de tu cuerpo todo un manuscrito (sube, sube, sube)\nSube, sube (oh)\n...\n\n******* This Lyrics is NOT for Commercial use *******\n(1409620049094)");
    })
  })

  it('un SpotifyClient puede retornar el ID de una Track en Spotify a partir de su nombre y artista', function(){

    return spotifyClient.getArtistID('Luis Fonsi').then((response) =>{

      assert.equal(response.artists.items[0].id,'4V8Sr092TqfHkfAA5fXXqG');
    })
  })

  it('un SpotifyClient puede retornar los albums en spotify de un artista a partir de su nombre y artista', function(){

    return spotifyClient.getArtistAlbums('Luis Fonsi').then((response) =>{

      assert.equal(response.items.length,20);
    })
  })
})

describe('Buscador tests', () => {
  let listaDeArtistas;
  let artista1;
  let artista2;
  let album1;
  let album2;
  let album3;
  let album4;
  let track1;
  let track2;
  let track3;
  let track4;
  let track5;
  let track6;
  let track7;
  let track8;

  beforeEach(() => {
    listaDeArtistas = []
    artista1 =  new Artista("fran", 1998, "argentina", 1);
    artista2 =  new Artista("anto", 1998, "argentina",2);
    album1 = new Album("album 1", 2004, 1, artista1);
    album2 = new Album("album 2", 2004, 2, artista1);
    album3 = new Album("album 3", 2004, 3, artista2);
    album4 = new Album("album 4", 2004, 4, artista2);
    track1 = new Track("cancion 1", ["genero1"], 500, album1, 1);
    track2 = new Track("cancion 2", ["genero2"], 500, album1, 2);
    track3 = new Track("cancion 3", ["genero3"], 500, album2, 3);
    track4 = new Track("cancion 4", ["genero4"], 500, album2, 4);
    track5 = new Track("cancion 1b", ["genero1"], 500, album3, 5);
    track6 = new Track("cancion 2b", ["genero2"], 500, album3, 6);
    track7 = new Track("cancion 3b", ["genero3", "genero1"], 500, album4, 7);
    track8 = new Track("cancion 4b", ["genero4"], 500, album4, 8);
    buscador = new Buscador();

    album1.agregarTrack(track1);
    album1.agregarTrack(track2);

    album2.agregarTrack(track3);
    album2.agregarTrack(track4);

    album3.agregarTrack(track5);
    album3.agregarTrack(track6);

    album4.agregarTrack(track7);
    album4.agregarTrack(track8);

    artista1.agregarAlbum(album1);
    artista1.agregarAlbum(album2);

    artista2.agregarAlbum(album3);
    artista2.agregarAlbum(album4);
    listaDeArtistas.push(artista1);
    listaDeArtistas.push(artista2);
   })

  it('un buscador puede hacer busquedas parciales de tracks', () => {
    
    let busquedaParcial1 =  buscador.getTracksConTitulo("cancion", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 8);

    busquedaParcial1 =  buscador.getTracksConTitulo("4", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 2);

    busquedaParcial1 =  buscador.getTracksConTitulo("Cancion", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 8);
  })

  it('un buscador puede hacer busquedas parciales de albums', () => {
    
    let busquedaParcial1 =  buscador.getAlbumsConNombre("album", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 4);

    busquedaParcial1 =  buscador.getAlbumsConNombre("4", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 1);

    busquedaParcial1 =  buscador.getAlbumsConNombre("AlBum", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 4);
  })

  it('un buscador puede hacer busquedas parciales de Artistas', () => {
    
    let busquedaParcial1 =  buscador.getArtistasConNombre("fran", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 1);

    busquedaParcial1 =  buscador.getArtistasConNombre("a", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 2);

    busquedaParcial1 =  buscador.getArtistasConNombre("FRan", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 1);
  })

  it('un buscador puede buscar todas las tracks de un Artista, por busqueda parcial', () => {
    
    let busquedaParcial1 =  buscador.getTracksDeArtistaConNombre("fran", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 4);

    assert.equal(busquedaParcial1[0].titulo, "cancion 1")
    assert.equal(busquedaParcial1[1].titulo, "cancion 2")
  })


  it('un buscador puede buscar todas las tracks de determinado genero, por busqueda parcial', () => {
    
    let busquedaParcial1 =  buscador.getTracksDelGenero("genero1", listaDeArtistas);
    assert.equal(busquedaParcial1.length, 3);
  })

  it('un buscador puede buscar todas las tracks con algun genero de una lista de generos, por busqueda parcial', () => {
    
    let busquedaParcial1 =  buscador.getTracksConGeneros(["genero1", "genero2"], listaDeArtistas);
    assert.equal(busquedaParcial1.length, 5);
  })

  it('un buscador puede hacer busquedas exactas por id de Tracks/Albums/Artistas', () => {
    
    let busquedaExacta1 = buscador.getArtistaConID(1, listaDeArtistas);
    let busquedaExacta2 = buscador.getAlbumConID(2, listaDeArtistas);
    let busquedaExacta3 = buscador.getTrackConID(3, listaDeArtistas);

    assert.equal(busquedaExacta1.nombre, "fran");
    assert.equal(busquedaExacta2.nombre, "album 2");
    assert.equal(busquedaExacta3.titulo, "cancion 3");
  })
})

describe("Usuario tests", () => {

  let usuario;
  let playlist;
  let artista1;
  let artista2;
  let album1;
  let album2;
  let album3;
  let album4;
  let track1;
  let track2;
  let track3;
  let track4;
  let track5;
  let track6;
  let track7;
  let track8;
  let listaDeTracks;

  beforeEach(() => {
    usuario = new Usuario();

    artista1 =  new Artista("fran", 1998, "argentina", 1);
    artista2 =  new Artista("anto", 1998, "argentina",2);
    album1 = new Album("album 1", 2004, 1, artista1);
    album2 = new Album("album 2", 2004, 2, artista1);
    album3 = new Album("album 3", 2004, 3, artista2);
    album4 = new Album("album 4", 2004, 4, artista2);
    track1 = new Track("cancion 1", ["genero1"], 500, album1, 1);
    track2 = new Track("cancion 2", ["genero2"], 500, album1, 2);
    track3 = new Track("cancion 3", ["genero3"], 500, album2, 3);
    track4 = new Track("cancion 4", ["genero4"], 500, album2, 4);
    track5 = new Track("cancion 1b", ["genero1"], 500, album3, 5);
    track6 = new Track("cancion 2b", ["genero2"], 500, album3, 6);
    track7 = new Track("cancion 3b", ["genero3", "genero1"], 500, album4, 7);
    track8 = new Track("cancion 4b", ["genero4"], 500, album4, 8);

    listaDeTracks = [];
    listaDeTracks.push(track1); 
    listaDeTracks.push(track2);
    listaDeTracks.push(track3);
    listaDeTracks.push(track4);
    listaDeTracks.push(track5);
    listaDeTracks.push(track6);
    listaDeTracks.push(track7);
    listaDeTracks.push(track8);

    playlist = new Playlist("playlist1", 0, 500, ["genero1", "genero2", "genero3", "genero4"], listaDeTracks);
   })

  it('un usuario puede escuchar una cancion', () => {
    
    usuario.escucharTrack(track1);
    assert.equal(usuario.getTemasEscuchados().length, 1);
    assert.equal(usuario.getTemasEscuchados()[0], track1);
  })

  it('un usuario puede escuchar una playlist', () => {
    usuario.escucharPlaylist(playlist);

    assert.equal(usuario.getTemasEscuchados().length, 8);
  })

  it('un usuario puede decir las veces que escucho un tema', () => {
    
    usuario.escucharPlaylist(playlist);
    usuario.escucharTrack(track1);
    
    assert.equal(usuario.getVecesQueEscuchoTema(track1), 2);
  })

  it('un usuario puede dar los 3 temas que mas escucho de un determinado artista', () => {

    usuario.escucharTrack(track1);
    usuario.escucharTrack(track1);
    usuario.escucharTrack(track1);
    usuario.escucharTrack(track1);

    usuario.escucharTrack(track2);
    usuario.escucharTrack(track2);
    usuario.escucharTrack(track2);

    usuario.escucharTrack(track3);
    usuario.escucharTrack(track3);

    usuario.escucharTrack(track4);

    assert.equal(usuario.getTracksMasEscuchadosDe("fran").length, 3);
    assert.equal(usuario.getTracksMasEscuchadosDe("fran")[0], track1);
    assert.equal(usuario.getTracksMasEscuchadosDe("fran")[1], track2);
    assert.equal(usuario.getTracksMasEscuchadosDe("fran")[2], track3);
  })
})

describe("manejadorDeObservadores tests", () => {
  let manejadorDeOb;
  let observador;
  let mock;

  beforeEach(() => {
    manejadorDeOb = new ManejadorDeObservadores();
    observador = new ServicioExternoAlbumObservator();
    mock = sinon.mock(observador);
  })

  it('un manejador de observadores puede agregar nuevos agregadores', () => {
    
    assert.equal(manejadorDeOb.observadores.length, 0)
    manejadorDeOb.agregarObservador(stub);
    assert.equal(manejadorDeOb.observadores.length, 1)
  })
})