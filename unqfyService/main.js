const comandos = require('./Comandos');

function ejecutarComandoCon(unStringDeComando, unaListaDeArgumentos){

  switch(unStringDeComando){
    case "agregarArtista":
      comandos.ComandoAgregarArtista.execute(unaListaDeArgumentos);
      break;
    case "agregarAlbum":
      comandos.ComandoAgregarAlbum.execute(unaListaDeArgumentos);
      break;
    case "agregarTrack":
      comandos.ComandoAgregarTrack.execute(unaListaDeArgumentos);
      break;
    case "crearPlayList":
      comandos.ComandoCrearPlayList.execute(unaListaDeArgumentos);
      break;
    case "eliminarArtista":
      comandos.ComandoEliminarArtista.execute(unaListaDeArgumentos);
      break;
    case "eliminarAlbum":
      comandos.ComandoEliminarAlbum.execute(unaListaDeArgumentos);
      break;
    case "eliminarTrack":
      comandos.ComandoEliminarTrack.execute(unaListaDeArgumentos);
      break;
    case "eliminarPlayList":
      comandos.ComandoEliminarPlayList.execute(unaListaDeArgumentos);
    case "getArtistas":
      comandos.ComandoGetArtistas.execute();
      break;
    case "getAlbums":
      comandos.ComandoGetAlbums.execute();
      break;
    case "getTracks":
      comandos.ComandoGetTracks.execute();
      break;
    case "getPlayLists":
      comandos.ComandoGetPlayList.execute();
      break;
    case "buscarPorNombre":
      comandos.ComandoBuscarPorNombre.execute(unaListaDeArgumentos);
      break;
    case "getTracksConGeneros":
      comandos.ComandoGetTracksConGeneros.execute(unaListaDeArgumentos);
      break;
    case "getTracksDeArtista":
      comandos.ComandoGetTracksDeArtista.execute(unaListaDeArgumentos);
      break;
    case "popularAlbumsParaArtista":
      comandos.ComandoPopulateAlbumsForArtist.execute(unaListaDeArgumentos);
      break;
    default: 
      comandos.ComandoInexistente.execute();
  }
}

function main(){
  let argumentos = process.argv.slice(2, process.argv.length);
  ejecutarComandoCon(argumentos[0], argumentos.slice(1, argumentos.length));
}

/* ESTRUCTURA DE LOS COMANDOS:
 * agregarArtista nombreDelArtista AñoDeNacimiento PaisDeOrigen;
 * agregarAlbum nombreDelAlbum añoDelanzamiento idDelArtistaQueLoCompuso;
 * agregarTrack nombreDeTrack duracion listaDeGeneros idDelAlbumAlQuePertenece; 
 * crearPlayList nombreDePlayList listaDeGeneros maximaDuracionDePlaylist
 * (la lista de generos es un string en donde cada genero esta separado por un espacio)
 * (las duraciones son expresadas en segundos)
 * ----------------------------------------------------------------------------------------
 * eliminarArtista idDeArtista;
 * eliminarAlbum idDeAlbum;
 * eliminarTrack idDeTrack;
 * eliminarPlayList nombreDePlayList
 * ----------------------------------------------------------------------------------------
 * getArtistas
 * getAlbums
 * getTracks
 * getPlayLists
 * ----------------------------------------------------------------------------------------
 * buscarPorNombre unNombre;
 * getTracksConGeneros unaListaDeGeneros; <-- (la lista de generos es un string en donde cada genero esta separado por un espacio)
 * getTracksDeArtista unidDeArtista;
 * ----------------------------------------------------------------------------------------
 * popularAlbumsParaArtista idDeUnArtista
 */

main();