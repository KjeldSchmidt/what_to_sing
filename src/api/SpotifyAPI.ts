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

const SpotifyAPI = {
    topTracks: (accessToken: string) => {
        return fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then( (response) => response.json())
            .then( (json) => json.items )
    }
}

export default SpotifyAPI;