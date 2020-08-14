const rp = require('request-promise');
const spotifyCreds = require('./spotifyCreds.json');
const fs = require('fs');

class SpotifyClient{

    constructor(){
        this._baseURL = 'https://' + 'api.spotify.com' + '/v1'; 
    }

    getArtistAlbums(nombreDeArtista){
        return this.getArtistID(nombreDeArtista).then((response) => {
            let id = response.artists.items[0].id;
            let options = {
                url: this._baseURL + '/artists/' + id + '/albums',
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
                url: this._baseURL + '/search',
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
            url: this._baseURL + '/me',
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