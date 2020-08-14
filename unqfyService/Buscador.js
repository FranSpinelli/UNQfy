class Buscador{

    getTracksConTitulo(unTitulo, listaDeArtistasDelSistema){
        let tracksDelSistema = this.getTracksDelSistema(listaDeArtistasDelSistema);
        return tracksDelSistema.filter( track => track.titulo.toLowerCase().includes(unTitulo.toLowerCase()))
    }

    getAlbumsConNombre(unNombre, listaDeArtistasDelSistema){
        let albumsDelSistema = this.getAlbumsDelSistema(listaDeArtistasDelSistema);
        return albumsDelSistema.filter(album => album.nombre.toLowerCase().includes(unNombre.toLowerCase())); 
    }

    getArtistasConNombre(unNombre, listaDeArtistasDelSistema){
        return listaDeArtistasDelSistema.filter(artista => artista.nombre.toLowerCase().includes(unNombre.toLowerCase()));
    }

    getPlaylistConNombre(unNombre, listaDePlaylistDelSistema){

        return listaDePlaylistDelSistema.filter(playlist => playlist.nombre.toLowerCase().includes(unNombre.toLowerCase()));
    }

    getTracksDeArtistaConNombre(unNombre, listaDeArtistasDelSistema){
        let albumsDelArtista = this.getAlbumsDelSistema(listaDeArtistasDelSistema).filter( 
            album => album.autor.nombre.toLowerCase().includes(unNombre.toLowerCase()));
        return albumsDelArtista.map( album => album.tracks).flat();
    }

    getTracksConGeneros(generos, artistasDeSistema){
        let resultadoFinal = [];
        generos.forEach(genero => {
            resultadoFinal = resultadoFinal.concat(this.getTracksDelGenero(genero, artistasDeSistema));
        });
        return [...new Set(resultadoFinal)];
    }

    getTracksDelGenero(unGenero, listaDeArtistasDelSistema){
        return this.getTracksDelSistema(listaDeArtistasDelSistema).filter( 
            track => track.generosMusicales.some( genero => genero.toLowerCase() === unGenero.toLowerCase()))
    }

    getArtistaConID(unID, listaDeArtistas){
        return listaDeArtistas.find( artista => artista.id === unID);
    }

    getAlbumConID(unID, listaDeArtistas){
        return this.getAlbumsDelSistema(listaDeArtistas).find(album => album.id === unID);
    }

    getTrackConID(unID, listaDeArtistas){
        return this.getTracksDelSistema(listaDeArtistas).find(track => track.id === unID);
    }

    getPlayListConID(unID, listaDePlayLists){
        return listaDePlayLists.find(playlist => playlist.idPlayList === unID);
    }

    getUserConID(unID, listaDeUsuarios){
        return listaDeUsuarios.find(user => user.id === unID);
    }

    getAlbumsDelSistema(listaDeArtistasDelSistema){
        return listaDeArtistasDelSistema.map( artista => artista.albums).flat();
    }

    getTracksDelSistema(listaDeArtistasDelSistema){
        let albumsDelSistema = this.getAlbumsDelSistema(listaDeArtistasDelSistema);
        return albumsDelSistema.map( album => album.tracks).flat();
    }

    albumIsInList(unaLista,unAlbum){
        return unaLista.filter(elem => elem.name === unAlbum.name).length > 0
    }

    hayArtistaConData(data, listaDeArtistas){
        return listaDeArtistas.filter(artista => artista.nombre === data.name && artista.pais === data.country)
        .length > 0; 
    }
}


module.exports = Buscador;