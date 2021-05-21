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

    authorizedFetch(url: string) : ReturnType<typeof fetch> {
        return fetch( url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
            .then( (response) => {
                if (response.status ===  401) {
                    return Promise.reject();
                }

                return response;
            })
    }

    topTracks( limit = 98) : Promise<Song[]> {
        // Spotify API will not respond with top tracks past Top 99
        let remaining = Math.min(limit, 98);
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
        return this.authorizedFetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}`)
            .then( (response) => response.json())
            .then( (json) => json.items )
    }

    private async userPlaylistsRequest() : Promise<SpotifyPlaylist[]> {
        return this.authorizedFetch(`https://api.spotify.com/v1/me/playlists` )
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
        return this.authorizedFetch( url )
            .then( (response) => response.json() )
            .then( (json) => json.items )
            .then( (items : PlaylistMember[]) => items.map( item => item.track))
            .then( (songs) => songs.map(SpotifyAPI.toSong))
    }

    static toSong(spotifySong : SpotifySong ) : Song  {
        return {
            title: spotifySong.name,
            artist: spotifySong.artists[0].name,
            albumArtUrl: spotifySong.album.images[2].url
        }
    }

    topArtists() : Promise<SpotifyArtist[]> {
        return this.authorizedFetch('https://api.spotify.com/v1/me/top/artists?limit=50')
            .then(response => response.json())
            .then(json => json.items)
            .then(items => {console.log("Logging in SpotifyAPI::topArtists"); console.dir(items); return items })
    }
}

export default SpotifyAPI;