const rp = require('request-promise');

class ApiCaller{

    getTrackLyrics(nombreDeTrack, nombreArtista){
        return this.getTrackID(nombreDeTrack, nombreArtista).then((response) => {

            var options = {
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
        var options = {
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

}

module.exports = ApiCaller;