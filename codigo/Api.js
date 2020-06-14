const funciones = require('./Comandos.js');
const bodyParser = require('body-parser')
const port = 8080;
const unqfy = funciones.getUNQfy();

const express = require('express');
const rootApp = express();
const artists = express();
const albums = express();
const tracks = express();

rootApp.route('/api').get((req,res) => {
    res.json({ message: 'yay! Bienvenido a UNQfy api' });
});

artists.use(bodyParser.json())

artists.route('/artists')
.get((req, res) => {
    if (req.query.name){
        let artistas = unqfy.searchByName(req.query.name).artists;
        
        res.json(artistas);
    }else{
        let artistas = unqfy.getArtistas();
        
        res.json(artistas);
    }
}).post((req,res) => {
    let nuevoArtista = unqfy.addArtist(req.body);
    funciones.saveUNQfy(unqfy);
    
    let responseData = {
        id : nuevoArtista.id,
        name : nuevoArtista.nombre,
        country : nuevoArtista.pais,
        albums : nuevoArtista.albums
    }

    res.status(201).json(responseData);
});

artists.route('/artists/:id')
.get((req, res) =>{
    let artistID = parseInt(req.params.id);

    let artista = unqfy.getArtistaConID(artistID);

    let responseData = {
        id : artista.id,
        name : artista.nombre,
        country : artista.pais,
        albums : artista.albums
    }
    res.status(200).json(responseData);

}).delete((req,res) => {
    let artistID = parseInt(req.params.id);

    unqfy.eliminarArtista(artistID);
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
}).patch((req,res) => {
    let artistID = parseInt(req.params.id);
    let artista = unqfy.getArtistaConID(artistID);
    artista.nombre = req.body.name;
    artista.pais = req.body.country;
    funciones.saveUNQfy(unqfy);

    let responseData = {
        id : artista.id,
        name : artista.nombre,
        country : artista.pais,
        albums : artista.albums 
    }

    res.status(200).json(responseData);
})

albums.use(bodyParser.json())
albums.route('/albums').get((req,res) => {
    if (req.query.name){
        let albums = unqfy.searchByName(req.query.name).albums;
        
        res.status(200).json(albums);
    }else{
        let finalAlbumsList = []
        let albums = unqfy.getAlbums().forEach(album => {
            let data = {
                nombre: album.nombre, 
                id: album.id,
                year: album.añoDeLanzamiento,
                tracks: album.tracks
            }
            finalAlbumsList.push(data);
        });
        
        res.status(200).json(finalAlbumsList);
    }
}).post((req,res) => {
    let nuevoAlbum = unqfy.addAlbum(req.body.artistId, req.body);
    funciones.saveUNQfy(unqfy);
    
    let responseData = {
        id : nuevoAlbum.id,
        name : nuevoAlbum.nombre,
        year : nuevoAlbum.añoDeLanzamiento,
        tracks : nuevoAlbum.tracks
    }

    res.status(201).json(responseData);
});

albums.route('/albums/:id')
.get((req,res) => {
    let albumID = parseInt(req.params.id);

    let album = unqfy.getAlbumConID(albumID);

    let responseData = {
        id : album.id,
        name : album.nombre,
        year : album.añoDeLanzamiento,
        tracks : album.tracks
    }
    res.status(200).json(responseData);
}).delete((req,res) => {
    let albumID = parseInt(req.params.id);

    unqfy.eliminarAlbum(albumID);
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
}).patch((req,res) => {
    let albumID = parseInt(req.params.id);
    let album = unqfy.getAlbumConID(albumID);
    album.añoDeLanzamiento = req.body.year;
    funciones.saveUNQfy(unqfy);

    let responseData = {
        id : album.id,
        name : album.nombre,
        year : album.añoDeLanzamiento,
        tracks : album.tracks
    }

    res.status(200).json(responseData);
})

tracks.route('/tracks/:id/lyrics')
.get((req,res) => {
    console.log(parseInt(req.params.id))
    let trackID = parseInt(req.params.id);
    let track = unqfy.getTrackConID(trackID);
    unqfy.getTrackLyrics(trackID).then( response => {
        
        funciones.saveUNQfy(unqfy);
        let responceData = {
            name: track.titulo,
            lyrics: response
        }

        res.status(200).json(responseData);
    });
})

rootApp.use('/api', artists, albums, tracks,);
rootApp.listen(port, () => console.log('where magic happens'));