import {Song} from "../types/SongType";

export type SpotifyArtist = {
    name: string,
    id: string,

}

export type SpotifyImage = {
    height: number,
    width: number,
    url: string
}

export type SpotifyAlbum = {
    name: string,
    images: SpotifyImage[]
}

export type SpotifySong = {
    name: string
    artists: SpotifyArtist[]
    id: string,
    popularity: number
    album: SpotifyAlbum
}

type PlaylistMember = {
    track: SpotifySong,
}

export type SpotifyPlaylist = {
    name: string,
    tracks: {
        href: string,
        total: number
    }
}

class SpotifyAPI {
    accessToken: string;

    constructor(accessToken : string) {
        this.accessToken = accessToken;
    }

    topTracks( limit: number = 50) : Promise<Song[]> {
        let remaining = limit;
        let offset = 0;
        const requestCalls : Promise<SpotifySong[]>[] = [];
        while (remaining > 49) {
            requestCalls.push( this.topTracksRequest(49, offset) )
            offset += 49;
            remaining -= 49;
        }

        requestCalls.push( this.topTracksRequest(remaining, offset) )

        return Promise.all(requestCalls)
            .then((results) => results.flat())
            .then((songs) => songs.map(SpotifyAPI.toSong))
    }

    private async topTracksRequest( limit: number, offset: number ) : Promise<SpotifySong[]> {
        return fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
            .then( (response) => response.json())
            .then( (json) => json.items )
    }

    playlists() {
        return this.userPlaylistsRequest();
    }

    private async userPlaylistsRequest() : Promise<SpotifyPlaylist[]> {
        return fetch(`https://api.spotify.com/v1/me/playlists`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
            .then((response) => response.json())
            .then((json) => json.items);
    }

    async songsFromPlaylists() : Promise<Song[]> {
        const trackUrls = await this.userPlaylistsRequest()
            .then((playlists) =>
                playlists.map( (playlist) => playlist.tracks.href )
            )

        const trackCalls : Promise<Song[]>[] = []
        trackUrls.forEach( (trackUrl) => {
            trackCalls.push( this.songsFromPlaylist(trackUrl) );
        });

        return Promise.all(trackCalls)
            .then((results) => results.flat())
    }

    songsFromPlaylist( url: string ) : Promise<Song[]> {
        return fetch( url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
            .then( (response) => response.json() )
            .then( (json) => json.items )
            .then( (items : PlaylistMember[]) => items.map( item => item.track))
            .then( track => { console.dir(track); return track; } )
            .then( (songs) => songs.map(SpotifyAPI.toSong))
    }

    static toSong(spotifySong : SpotifySong ) : Song  {
        return {
            title: spotifySong.name,
            artist: spotifySong.artists[0].name,
            albumArtUrl: spotifySong.album.images[2].url
        }
    }
}

export default SpotifyAPI;