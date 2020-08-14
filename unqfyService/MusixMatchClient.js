const rp = require('request-promise');

class MusixMatchClient{

    constructor(){
        this._baseURL = 'http://' + 'api.musixmatch.com' + '/ws' + '/1.1';
        this._apiKey = '2d0fce8e9efeee8607bd778887fe9858';
    }   
    
    getTrackLyrics(nombreDeTrack, nombreArtista){
        return this.getTrackID(nombreDeTrack, nombreArtista).then((response) => {

            let options = {
                uri: this._baseURL + '/track.lyrics.get',
                qs: {
                    apikey: this._apiKey,
                    track_id: response.message.body.track_list[0].track.track_id
                },
                json: true
            };

            return rp.get(options)
        })
    }

    getTrackID(unNombreDeTrack, unNombreDeArtista){
        let options = {
            uri: this._baseURL + '/track.search',
            qs: {
                apikey: this._apiKey,
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
}

module.exports = MusixMatchClient;