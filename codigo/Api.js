const funciones = require('./Comandos.js');
const bodyParser = require('body-parser');
const ErroresApi = require('./ErroresApi');
const Errores = require('./Errores.js');
const errorHandler = require('./ApiErrorHandler.js');

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

artists.use(bodyParser.json());

artists.route('/artists')
.get((req, res) => {

    let finalArtistList = [];
    if (req.query.name){
        let artistas = unqfy.searchByName(req.query.name).artists.forEach(artista => {
            let data = {
                id: artista.id,
                name: artista.nombre,
                albums: artista.albums,
                country: artista.pais
            }
            finalArtistList.push(data);
        });;
        
        res.json(finalArtistList);
    }else{
        let artistas = unqfy.getArtistas().forEach(artista => {
            let data = {
                id: artista.id,
                name: artista.nombre,
                albums: artista.albums,
                country: artista.pais
            }
            finalArtistList.push(data);
        });;
        
        res.json(finalArtistList);
    }
}).post((req,res) => {
    if(req.body.name === undefined || req.body.country === undefined){
        throw new ErroresApi.MissingValue()
    }
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

    let finalAlbums = [];
    let artista = unqfy.getArtistaConID(artistID);
    
    artista.albums.forEach(album =>{
        let data = {
            name: album.nombre, 
            id: album.id,
            year: album.añoDeLanzamiento,
            tracks: album.tracks
        }
        finalAlbums.push(data);
    })


    let responseData = {
        id : artista.id,
        name : artista.nombre,
        country : artista.pais,
        albums : finalAlbums
    }
    res.status(200).json(responseData);

}).delete((req,res) => {
    let artistID = parseInt(req.params.id);

    unqfy.eliminarArtista(artistID);
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
}).patch((req,res) => {
    if(req.body.name === undefined || req.body.country === undefined){
        throw new ErroresApi.MissingValue()
    }

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
    let finalAlbumsList = []
    if (req.query.name){
        let albums = unqfy.searchByName(req.query.name).albums.forEach(album => {
            let data = {
                name: album.nombre, 
                id: album.id,
                year: album.añoDeLanzamiento,
                tracks: album.tracks
            }
            finalAlbumsList.push(data);
        });;
        
        res.status(200).json(finalAlbumsList);
    }else{
        
        let albums = unqfy.getAlbums().forEach(album => {
            let data = {
                name: album.nombre, 
                id: album.id,
                year: album.añoDeLanzamiento,
                tracks: album.tracks
            }
            finalAlbumsList.push(data);
        });
        
        res.status(200).json(finalAlbumsList);
    }
}).post((req,res) => {
    if(req.body.artistId === undefined || req.body.name === undefined || req.body.year === undefined){
        throw new ErroresApi.MissingValue()
    }
    try{
    let nuevoAlbum = unqfy.addAlbum(req.body.artistId, req.body);
    funciones.saveUNQfy(unqfy);
    
    let responseData = {
        id : nuevoAlbum.id,
        name : nuevoAlbum.nombre,
        year : nuevoAlbum.añoDeLanzamiento,
        tracks : nuevoAlbum.tracks
    }
    res.status(201).json(responseData);

    }catch(err){
        if(err instanceof Errores.NoExisteElementoConID){
            throw new ErroresApi.InexistentRelatedSource;
        }else{
            throw err;
        }
    }
});

albums.route('/albums/:id')
.get((req,res) => {
    let albumID = parseInt(req.params.id);

    let album = unqfy.getAlbumConID(albumID);
    let albumTracks = [];
    album.tracks.forEach(track => {
        let data = {
            title: track.titulo
        }
        albumTracks.push(data);
    })

    let responseData = {
        id : album.id,
        name : album.nombre,
        year : album.añoDeLanzamiento,
        tracks : albumTracks
    }
    res.status(200).json(responseData);
}).delete((req,res) => {
    let albumID = parseInt(req.params.id);

    unqfy.eliminarAlbum(albumID);
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
}).patch((req,res) => {
    if(req.body.year === undefined){
        throw new ErroresApi.MissingValue()
    }

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
rootApp.use(function(req,res){
    throw new ErroresApi.WrongRoute();
})
rootApp.use(errorHandler);
rootApp.listen(port, () => console.log('where magic happens'));