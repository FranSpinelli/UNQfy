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
    case "eliminarArtista":
      comandos.ComandoEliminarArtista.execute(unaListaDeArgumentos);
      break;
    case "eliminarAlbum":
      comandos.ComandoEliminarAlbum.execute(unaListaDeArgumentos);
      break;
    case "getArtistas":
      comandos.ComandoGetArtistas.execute(unaListaDeArgumentos);
      break;
    case "eliminarTrack":
      comandos.ComandoEliminarTrack .execute(unaListaDeArgumentos);
      break;
    case "getArtistas":
      comandos.ComandoGetAlbums.execute();
      break;
    case "getAlbums":
      comandos.ComandoGetAlbums.execute();
      break;
    case "getTracks":
      comandos.ComandoGetTracks.execute();
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
 * (la lista de generos es un string en donde cada genero esta separado por un espacio)
 * ----------------------------------------------------------------------------------------
 * eliminarArtista idDeArtista;
 * eliminarAlbum idDeAlbum;
 * eliminarTrack idDeTrack;
 * ----------------------------------------------------------------------------------------
 * getArtistas
 * getAlbums
 * getTracks
 * ----------------------------------------------------------------------------------------
 * buscarPorNombre unNombre;
 * getTracksConGeneros unaListaDeGeneros; <-- (la lista de generos es un string en donde cada genero esta separado por un espacio)
 * getTracksDeArtista unidDeArtista;
 */

//main();

function reduceList(lista, nro){

  return lista.reduce((accumulator, elem) => {

    if(accumulator.reduce( (a,b) => { return a + b },0 ) + elem <= nro){
      return accumulator.concat([elem]);
    }else{
      return accumulator;
    }
  }, [])
}


function reduceList2(lista, nro){

  result = [];

  lista.forEach(element => {
    
    console.log(element)
    console.log(result)

    if(result.reduce( (a,b) => {return a + b},0) + element <= nro){
    
      result.push(element);

    }

  });

  return result;
}


//console.log(reduceList2([1,2,3,5,6,7,8,9], 10));
console.log(reduceList([1,2,3,4,5,6,7,8,9], 10));
