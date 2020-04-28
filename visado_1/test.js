/* eslint-env node, mocha */

const assert = require('chai').assert;
const libunqfy = require('./unqfy');
const Track = require('./track');
const Album = require('./Album');
const Artista = require('./Artista');
const Database = require('./Database');

function createAndAddArtist(unqfy, artistName, country) {
  const artist = unqfy.addArtist({ name: artistName, country });
  return artist;
}

function createAndAddAlbum(unqfy, artistId, albumName, albumYear) {
  return unqfy.addAlbum(artistId, { name: albumName, year: albumYear });
}

function createAndAddTrack(unqfy, albumName, trackName, trackDuraction, trackGenres) {
  return unqfy.addTrack(albumName, { name: trackName, duration: trackDuraction, genres: trackGenres });
}


describe('Add, remove and filter data', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
  });

  it('should add an artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');

    assert.equal(artist.name, 'Guns n\' Roses');
    assert.equal(artist.country, 'USA');

  });

  it('should add an album to an artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);

    assert.equal(album.name, 'Appetite for Destruction');
    assert.equal(album.year, 1987);
  });

  it('should add a track to an album', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
    const track = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);

    assert.equal(track.name, 'Welcome to the jungle');
    assert.strictEqual(track.duration, 200);
    assert.equal(track.genres.includes('rock'), true);
    assert.equal(track.genres.includes('hard rock'), true);
    assert.lengthOf(track.genres, 2);
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
  });

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

    const matchingTracks = unqfy.getTracksMatchingArtist(artist);

    assert.isArray(matchingTracks);
    assert.lengthOf(matchingTracks, 3);
    assert.isTrue(matchingTracks.includes(t1));
    assert.isTrue(matchingTracks.includes(t2));
    assert.isTrue(matchingTracks.includes(t3));
  });
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

    assert.equal(playlist.name, 'my playlist');
    assert.isAtMost(playlist.duration(), 1400);
    assert.isTrue(playlist.hasTrack(t1));
    assert.isTrue(playlist.hasTrack(t2));
    assert.isTrue(playlist.hasTrack(t3));
    assert.isTrue(playlist.hasTrack(t4));
    assert.lengthOf(playlist.tracks, 4);
  });
});

describe('Track tests', () => {
  let album = null;
  let track = null;

  beforeEach(() => {
    album = new Album("unNombre", 1978)
    track = new Track("unTitulo", ["genero1", "genero2"], 100, album, 1);
  })

  it('chequeo de constructor y getters', () => {
     
    assert.equal(track.titulo, "unTitulo");
    assert.equal(track.generosMusicales[0], "genero1");
    assert.equal(track.generosMusicales[1], "genero2");
    assert.equal(track.duracion, 100);
    assert.equal(track.albumAlquePertenece.nombre, "unNombre");
    assert.equal(track.id, 1);
  })

});

describe('Album tests', () => {
  let album = null;
  let track1 = null;
  let track2 = null;

  beforeEach(() => {
    album = new Album("unNombre", 1978,0)
    track1 = new Track("unTitulo", ["genero1", "genero2"], 100, album,0);
    track2 = new Track("otroTitulo", ["genero3", "genero4"], 200, album,1);
  })

  it('chequeo de constructor y getters', () => {
    
    assert.equal(album.nombre, "unNombre");
    assert.equal(album.añoDeLanzamiento, 1978);
    assert.equal(album.tracks.length, 0);
    assert.equal(album.id, 0);
  })
  
  it('un album no tiene tracks repetidos', () => {
    
    album.agregarTrack(track1);
    assert.equal(album.tracks.length, 1);

    album.agregarTrack(track1);
    assert.equal(album.tracks.length, 1);
  })

  it('un album no tiene 2 tracks con mismo nombre', () => {
    const track3 = new Track("unTitulo", ["genero5", "genero6"], 300, album,2);

    album.agregarTrack(track1);
    assert.equal(album.tracks.length, 1);

    album.agregarTrack(track3);
    assert.equal(album.tracks.length, 1);
  })

  it('test de relacion circular', () => {
    
    album.agregarTrack(track1);
    album.agregarTrack(track2);
    assert.equal(album.tracks.length, 2);

    assert.equal(album.tracks[0].albumAlquePertenece.tracks.length, 2)
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
    artista = new Artista("unNombre", 1968,0);
    album = new Album("unNombre", 1978,0);
    album2 = new Album("otroNombre", 1978,1);
  })

  it('chequeo de constructor y getters', () => { 
    
    assert.equal(artista.nombre, "unNombre");
    assert.equal(artista.añoDeNacimiento, 1968);
    assert.equal(artista.albums.length, 0);
    assert.equal(artista.id, 0);
  })

  it('un artista no tiene albums repetidos', () => {
    
    artista.agregarAlbum(album);
    assert.equal(artista.albums.length, 1);

    artista.agregarAlbum(album);
    assert.equal(artista.albums.length, 1);
  })

  it('un artista no tiene 2 albums con el mismo nombre', () => {
    const album3 = new Album("unNombre", 1988,2);

    artista.agregarAlbum(album);
    assert.equal(artista.albums.length, 1);

    artista.agregarAlbum(album3);
    assert.equal(artista.albums.length, 1);
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

describe('Database tests', () => {
  let database;
  let artista1;
  let artista2;

  beforeEach(() => {
   database = new Database();
   artista1 = new Artista("fran", 1998, 0);
   artista2 = new Artista("anto", 1998, 1);
  })

  it('una database no puede tener 2 artistas con el mismo nombre', () => {
    const artista3 = new Artista("fran", 1988,2);

    database.agregarArtista(artista1);
    assert.equal(database.artistas.length, 1);

    database.agregarArtista(artista3);
    assert.equal(database.artistas.length, 1);
  })

  it('una database no puede tener 2 artistas iguales', () => {

    database.agregarArtista(artista1);
    assert.equal(database.artistas.length, 1);

    database.agregarArtista(artista1);
    assert.equal(database.artistas.length, 1);
  })

  it('una database puede eliminar un artista', () => {

    database.agregarArtista(artista1);
    assert.equal(database.artistas.length, 1);

    database.eliminarArtista("fran");
    assert.equal(database.artistas.length, 0);
  })

  it('una database puede generar id para artistas, albums y tracks', () => {

    claveDeTrack = database.generarClaveDeTrack();
    claveDeTrack2 = database.generarClaveDeTrack();
    claveDeAlbum = database.generarClaveDeAlbum();
    claveDeAlbum2 = database.generarClaveDeAlbum();
    claveDeArtista = database.generarClaveDeArtista();
    claveDeArtista2 = database.generarClaveDeArtista();

    assert.equal(claveDeTrack, 1);
    assert.equal(claveDeTrack2, 2);
    assert.equal(claveDeAlbum, 1);
    assert.equal(claveDeAlbum2, 2);
    assert.equal(claveDeArtista, 1);
    assert.equal(claveDeArtista2, 2);

  })
})