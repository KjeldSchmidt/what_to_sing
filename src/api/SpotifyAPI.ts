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

type SavedTrackObject = {
    track: SpotifySong,
    added_at: Date
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

    async savedSongs() : Promise<Song[]> {
        return this.fetchAllPages<SavedTrackObject>("https://api.spotify.com/v1/me/tracks?limit=50")
            .then( savedTracks =>
                savedTracks.map( (savedTrack : SavedTrackObject ) => savedTrack.track)
            )
            .then((songs) => songs.map(SpotifyAPI.toSong));
    }

    private async fetchAllPages<Type>(url: string) : Promise<Type[]> {
        const results : Type[] = [];
        do {
            await this.authorizedFetch(url)
                .then(response => response.json())
                .then(json => {
                    url = json.next;
                    return json.items;
                })
                .then( items => results.push(...items) )
        } while (url != null);

        return results;
    }

    private async topTracksRequest( limit: number, offset: number ) : Promise<SpotifySong[]> {
        return this.authorizedFetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}`)
            .then( (response) => response.json())
            .then( (json) => json.items )
    }

    private async userPlaylistsRequest() : Promise<SpotifyPlaylist[]> {
        return this.fetchAllPages(`https://api.spotify.com/v1/me/playlists?limit=50` )
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
        return this.fetchAllPages<PlaylistMember>(url)
            .then( (items : PlaylistMember[]) => items.map( item => item.track))
            .then( (songs) => songs.map(SpotifyAPI.toSong))
    }

    static toSong(spotifySong : SpotifySong ) : Song  {
        const images = spotifySong.album.images;
        let imageUrl = "";
        if (images.length != 0) {
            imageUrl = images[ images.length - 1 ].url;
        }

        return {
            title: spotifySong.name,
            artist: spotifySong.artists[0].name,
            albumArtUrl: imageUrl
        }
    }

    topArtists() : Promise<SpotifyArtist[]> {
        return this.authorizedFetch('https://api.spotify.com/v1/me/top/artists?limit=50')
            .then(response => response.json())
            .then(json => json.items)
    }
}

export default SpotifyAPI;