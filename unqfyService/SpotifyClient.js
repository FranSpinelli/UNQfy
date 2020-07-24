const rp = require('request-promise');
const spotifyCreds = require('./spotifyCreds.json');
const fs = require('fs');

class SpotifyClient{

    getArtistAlbums(nombreDeArtista){
        return this.getArtistID(nombreDeArtista).then((response) => {
            let id = response.artists.items[0].id;
            let options = {
                url: 'https://api.spotify.com/v1/artists/' + id + '/albums',
                headers: { Authorization: 'Bearer ' + spotifyCreds.access_token},
                json: true,
                qs: {
                    limit: 20 
                }
            }

            return rp.get(options);
        })
    }

    getArtistID(unNombreDeArtista){
    
        return this.probarYActualizarConexionSpotify().then(() => {
            let options = {
                url: 'https://api.spotify.com/v1/search',
                headers: { Authorization: 'Bearer ' + spotifyCreds.access_token},
                json: true,
                qs: {
                    q: unNombreDeArtista,
                    type: "artist",
                    limit: 1
                }
            };

            return rp.get(options)
        })
    }

    probarYActualizarConexionSpotify(){
        let options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: 'Bearer ' + spotifyCreds.access_token},
            json: true,
        };

        return rp.get(options).catch((error) =>{
            
            let options = {
                method: 'POST',
                uri: 'https://accounts.spotify.com/api/token',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization : "Basic ZDM4YTAxMTNhZDNlNDI5YzlkYmZlNGVkNDgzYTI4NzQ6YTkxNzZjYWMyMGRiNDM5Mzg3N2U2YTBmZmI5OWJmZjM="
                },
                form: {
                    grant_type: "refresh_token",
                    refresh_token: spotifyCreds.refresh_token
                },
            };
            
            return rp(options).then(function(response){
                let responseJSON = JSON.parse(response);

                spotifyCreds.access_token = responseJSON.access_token;
                fs.writeFile('spotifyCreds.json', JSON.stringify(spotifyCreds),(err) => {
                    if (err) {return err}
                });
            });
        })
    }
}

module.exports = SpotifyClient;

/*
getTrackLyrics(nombreDeTrack, nombreArtista){
        return this.getTrackID(nombreDeTrack, nombreArtista).then((response) => {

            let options = {
                uri: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
                qs: {
                    apikey: '2d0fce8e9efeee8607bd778887fe9858',
                    track_id: response.message.body.track_list[0].track.track_id
                },
                json: true
            };

            return rp.get(options)
        })
    }

    getTrackID(unNombreDeTrack, unNombreDeArtista){
        let options = {
            uri: 'http://api.musixmatch.com/ws/1.1/track.search',
            qs: {
                apikey: '2d0fce8e9efeee8607bd778887fe9858',
                q_track: unNombreDeTrack,
                q_artist: unNombreDeArtista,
                f_has_lyrics: true,
                page_size: 1,
                s_track_rating: 'desc'
            },
            json: true
        };

        return rp.get(options)
    }
*/