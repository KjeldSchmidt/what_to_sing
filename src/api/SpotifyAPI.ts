export type SpotifyArtist = {
    name: string,
    id: string,

}

export type SpotifySong = {
    name: string
    artists: SpotifyArtist[]
    id: string,
    popularity: number
}

class SpotifyAPI {
    static async topTracks(accessToken: string, limit: number = 50) : Promise<SpotifySong[]> {
        let remaining = limit;
        let offset = 0;
        const requestCalls : Promise<SpotifySong[]>[] = [];
        while (remaining > 49) {
            requestCalls.push( this.topTracksRequest(accessToken, 49, offset) )
            offset += 49;
            remaining -= 49;
        }

        requestCalls.push( this.topTracksRequest(accessToken, remaining, offset) )

        return Promise.all(requestCalls)
            .then((results) => results.flat())
    }

    private static async topTracksRequest(accessToken: string, limit: number, offset: number ) : Promise<SpotifySong[]> {
        return fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then( (response) => response.json())
            .then( (json) => json.items )
    }
}

export default SpotifyAPI;