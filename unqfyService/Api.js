const funciones = require('./Comandos.js');
const bodyParser = require('body-parser');
const ErroresApi = require('./ErroresApi');
const Errores = require('./Errores');
const deepEqual = require('deep-equal');
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
    
    let listaPlayListsConNombre;
    let listaPlayListsConDuracionMenorA;
    let listaPlayListsConDuracionMayorA;

    if(req.query.name !== undefined) {listaPlayListsConNombre = unqfy.searchByName(req.query.name).playlists}
    if(req.query.durationLT !== undefined) {listaPlayListsConDuracionMenorA = playlists.filter(playlist => playlist.duracion < (req.query.durationLT))}
    if(req.query.durationGT !== undefined) {listaPlayListsConDuracionMayorA = playlists.filter(playlist => playlist.duracion > (req.query.durationGT))}

    let responseData = intersectionOfLists(listaPlayListsConNombre, listaPlayListsConDuracionMenorA, listaPlayListsConDuracionMayorA);
    res.status(200).json(responseData.map(playlist => returnedPlayList(playlist)));
}).post((req, res) =>{
    
    if(req.body.tracks === undefined){
        
        let nuevaPlaylist = crearPlayListAPartirDeGenerosYDuracion(req);
        res.status(200).json(returnedPlayList(nuevaPlaylist));
    }else{
        if(req.body.name === undefined){
            throw new ErroresApi.MissingValue();
        }

        try{
            
            let nuevaPlaylist = crearPlayListAPartirDeListaDeTracks(req);
            res.status(200).json(returnedPlayList(nuevaPlaylist));
        }catch(err){
            if(err instanceof Errores.NoExisteElementoConID){
                throw new ErroresApi.InexistentRelatedSource;
            }else{
                throw err;
            }
        }
    }
    
});

playlists.route('/playlists/:id')
.get((req, res) => {
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let playlist = unqfy.getPlayListConID(parseInt(req.params.id));

    res.status(200).json(returnedPlayList(playlist));
}).delete((req,res) => {
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let playListAEliminar = unqfy.getPlayListConID(parseInt(req.params.id));
    unqfy.eliminarPlayList(playListAEliminar.nombre);
    
    funciones.saveUNQfy(unqfy);

    res.sendStatus(204);
})

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

    let albums = unArtista.albums.map(album => returnedAlbum(album));

    return {
        id: unArtista.id,
        name: unArtista.nombre,
        albums: albums,
        country: unArtista.pais
    }
}

function returnedAlbum(unAlbum){
    
    let tracks = unAlbum.tracks.map(track => {
        return{
            title: track.titulo,
            duration: track.duracion
        }
    })

    return {
        name: unAlbum.nombre, 
        id: unAlbum.id,
        year: unAlbum.añoDeLanzamiento,
        tracks: tracks
    }
}

function returnedPlayList(unaPlayList){
    
    let listaTracks = unaPlayList.tracks.map(track => {
        return {
            title: track.titulo,
            duration: track.duracion
        }
    })

    return {
        id: unaPlayList.idPlayList,
        name: unaPlayList.nombre,
        duration:unaPlayList.duracion,
        genres: unaPlayList.genero,
        tracks: listaTracks
    }
}

function artistMissingValueChecking(request){
    if(request.body.name === undefined || request.body.country === undefined){
        throw new ErroresApi.MissingValue()
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

function playlistsMissingValueCheckingForPost(request){
    if(request.body.name === undefined || request.body.genres === undefined || request.body.maxDuration === undefined){
        throw new Error.MissingValue();
    }
}

function intersectionOfLists(){

    let listaSinUndefineds = Array.from(arguments).filter(lista => lista !== undefined)
    let listaMasLarga = listaSinUndefineds.sort((a, b) => b.length - a.length).splice(0,1).flat();

    return listaMasLarga.filter(playlist => aparecePlayListEnTodasLasListas(playlist,listaSinUndefineds));
}

function aparecePlayListEnTodasLasListas(playlist,listaDeListas){

    const contienePlayList = (unaPlayList, unaLista) => unaLista.some(playL => deepEqual(unaPlayList,playL,true));

    return listaDeListas.every(lista => contienePlayList(playlist, lista));
}

function crearPlayListAPartirDeGenerosYDuracion(req){
    playlistsMissingValueCheckingForPost(req);
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let nuevaPlaylist = unqfy.createPlaylist(req.body.name, req.body.genres, parseInt(req.body.maxDuration));
    funciones.saveUNQfy(unqfy);

    return nuevaPlaylist;
}

function crearPlayListAPartirDeListaDeTracks(req){
    let unqfy = funciones.getUNQfy(agregarNotificationServiceClientComoObservador);
    let nuevaPlaylist = unqfy.crearPlaylistConTracksConID(req.body.name, req.body.tracks);
    funciones.saveUNQfy(unqfy);
    
    return nuevaPlaylist;
}