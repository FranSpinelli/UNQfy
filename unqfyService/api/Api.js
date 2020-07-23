const funciones = require('./Comandos.js');
const bodyParser = require('body-parser');
const ErroresApi = require('../errores/ErroresApi');
const Errores = require('../errores/Errores');
const errorHandler = require('./ApiErrorHandler');

let agregarNotificationServiceClientComoObservador = process.argv[2];

const port = 8080;
//const unqfy = funciones.getUNQfy();

const express = require('express');
const rootApp = express();
const artists = express();
const albums = express();
const tracks = express();
const playlists = express();

rootApp.use(bodyParser.json());

rootApp.route('/api').get((req,res) => {
    res.json({ message: 'yay! Bienvenido a UNQfy api' });
});

artists.route('/artists')
.get((req, res) => {
    
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    
    let artistas = []
    if (req.query.name){
        artistas = unqfy.searchByName(req.query.name).artists.map(artista => {    
            return returnedArtist(artista);
        });
    }else{
        artistas = unqfy.getArtistas().map(artista => {
            return returnedArtist(artista);
        });
    }
    res.json(artistas);
}).post((req,res) => {

    artistMissingValueChecking(req);
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let nuevoArtista = unqfy.addArtist(req.body);
    funciones.saveUNQfy(unqfy);

    res.status(201).json(returnedArtist(nuevoArtista));
});

artists.route('/artists/:id')
.get((req, res) =>{
    
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let artista = unqfy.getArtistaConID(parseInt(req.params.id));
    res.status(200).json(returnedArtist(artista));
}).delete((req,res) => {
    
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    unqfy.eliminarArtista(parseInt(req.params.id));
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
}).patch((req,res) => {
    
    artistMissingValueChecking(req);
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let artista = unqfy.getArtistaConID(parseInt(req.params.id));  
    
    artista.nombre = req.body.name;
    artista.pais = req.body.country;

    funciones.saveUNQfy(unqfy);
    res.status(200).json(returnedArtist(artista));
})
//--------------------------------------------------------------------------------------------------------------
albums.route('/albums').get((req,res) => {
    
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let albums = []
    if (req.query.name){
        albums = unqfy.searchByName(req.query.name).albums.map(album => {
            return returnedAlbum(album);
        });
    }else{
        albums = unqfy.getAlbums().map(album => {
            return returnedAlbum(album);
        });
    }
    res.status(200).json(albums);
}).post((req,res) => {
    albumMissingValueChecking(req);
    try{
        let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
        let nuevoAlbum = unqfy.addAlbum(req.body.artistId, req.body);
        funciones.saveUNQfy(unqfy);

        res.status(201).json(returnedAlbum(nuevoAlbum));
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
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let album = unqfy.getAlbumConID(parseInt(req.params.id));

    res.status(200).json(returnedAlbum(album));
}).delete((req,res) => {

    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    unqfy.eliminarAlbum(parseInt(req.params.id));
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
}).patch((req,res) => {
    if(req.body.year === undefined){
        throw new ErroresApi.MissingValue()
    }

    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let album = unqfy.getAlbumConID(parseInt(req.params.id));    
    album.añoDeLanzamiento = req.body.year;
    funciones.saveUNQfy(unqfy);

    res.status(200).json(returnedAlbum(album));
})
//--------------------------------------------------------------------------------------
tracks.route('/tracks/:id/lyrics')
.get((req,res) => {

    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let track = unqfy.getTrackConID(parseInt(req.params.id));
    unqfy.getTrackLyrics(parseInt(req.params.id)).then( response => {
        
        funciones.saveUNQfy(unqfy);
        let responceData = {
            name: track.titulo,
            lyrics: response
        }

        res.status(200).json(responceData);
    }).catch((error) => {
        throw error;
    });
})
//---------------------------------------------------------------------------------------
playlists.route('/playlists')
.get((req,res) => {
    
    playlistsMissingValueChecking(req);
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let playlists = unqfy.getPlayLists();
    
    let lista1 = [];
    let lista2 = [];
    let lista3 = [];

    if(req.query.name !== undefined) {lista1 = unqfy.searchByName(req.query.name).playlists}
    if(req.query.durationLT !== undefined) {lista2 = playlists.filter(playlist => playlist.duracion < (req.query.durationLT))}
    if(req.query.durationGT !== undefined) {lista3 = playlists.filter(playlist => playlist.duracion > (req.query.durationGT))}

    let responseData = intersectionOfLists(lista1, lista2, lista3);
    res.status(200).json(responseData);
}).post((req, res) =>{
    
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let nuevaPlaylist = unqfy.createPlaylist(req.body.name, req.body.genres, req.body.maxDuration);
    funciones.saveUNQfy(unqfy);

    res.status(200).json(nuevaPlaylist);
});

//--------------------------------------------------------------------------------------
rootApp.use('/api', artists, albums, tracks,playlists);
rootApp.use(function(req,res){
    throw new ErroresApi.WrongRoute();
});
rootApp.use(errorHandler);
rootApp.listen(port, () => console.log('where magic happens'));

//----------------------------------------------------------------------------------------
//FUNCIONES AUXILIARES--------------------------------------------------------------------

function returnedArtist(unArtista){

    let albums = unArtista.albums.map(album =>{
        return {
            name: album.nombre, 
            id: album.id,
            year: album.añoDeLanzamiento,
            tracks: album.tracks
        }
    })

    return {
        id: unArtista.id,
        name: unArtista.nombre,
        albums: albums,
        country: unArtista.pais
    }
}
function artistMissingValueChecking(request){
    if(request.body.name === undefined || request.body.country === undefined){
        throw new ErroresApi.MissingValue()
    }
}

function returnedAlbum(unAlbum){
    
    let tracks = unAlbum.tracks.map(track => {
        return{
            title: track.titulo
        }
    })

    return {
        name: unAlbum.nombre, 
        id: unAlbum.id,
        year: unAlbum.añoDeLanzamiento,
        tracks: tracks
    }
}

function albumMissingValueChecking(request){
    if(request.body.artistId === undefined || request.body.name === undefined || request.body.year === undefined){
        throw new ErroresApi.MissingValue()
    }
}

function playlistsMissingValueChecking(request){
    if(request.query.name === undefined && request.query.durationLT === undefined && 
    request.query.durationGT === undefined){
        throw new ErroresApi.MissingValue();
    }
}

function intersectionOfLists(){
    return Array.from(arguments).reduce((a, b) => a.filter(c => b.includes(c)));
}