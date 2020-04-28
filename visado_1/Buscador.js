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

    getAlbumsDelSistema(listaDeArtistasDelSistema){
        return listaDeArtistasDelSistema.map( artista => artista.albums).flat();
    }

    getTracksDelSistema(listaDeArtistasDelSistema){
        let albumsDelSistema = this.getAlbumsDelSistema(listaDeArtistasDelSistema);
        return albumsDelSistema.map( album => album.tracks).flat();
    }
}


module.exports = Buscador;