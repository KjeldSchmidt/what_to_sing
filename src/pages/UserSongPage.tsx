import React from "react";
import SpotifyAPI from "../api/SpotifyAPI";
import SongCatalog from "../util/SongCatalog";
import {Song} from "../types/SongType";

type UserSongProps = {

}

type UserSongState = {
    favoriteSongs: Song[],
    karaokeSongs: Song[]
}

class UserSongPage extends React.Component<UserSongProps, UserSongState> {
    private catalog: SongCatalog = new SongCatalog();
    private spotifyAPI : SpotifyAPI;

    constructor(props: UserSongProps) {
        super(props);
        const hashFragment = window.location.hash;
        const accessToken = hashFragment.slice(1).split('&')[0].split('=')[1];
        this.spotifyAPI = new SpotifyAPI(accessToken);

        this.state = {
            favoriteSongs: [],
            karaokeSongs: []
        }
    }

    addFavoriteSongs( songs: Song[] ) : void {
        const newFavorite : Song[] = [];
        songs.forEach( song => {
            const entryExists = this.state.favoriteSongs
                .some( candidate => {
                    return song.artist === candidate.artist && song.title === candidate.title
                });

            if (!entryExists) {
                newFavorite.push(song)
            }
        });

        const newKaraoke = this.catalog.findMatches(newFavorite);

        this.setState({
            favoriteSongs: [...this.state.favoriteSongs, ...newFavorite],
            karaokeSongs: [...this.state.karaokeSongs, ...newKaraoke],
        });
    }

    componentDidMount() {
        this.spotifyAPI.topTracks(200)
            .then( (topTracks: Song[]) => this.addFavoriteSongs(topTracks))

        this.spotifyAPI.songsFromPlaylists()
            .then( (playlistTracks: Song[]) => this.addFavoriteSongs(playlistTracks))
    }

    render() {
        return (
         <div>
             Songs:
             {this.state.karaokeSongs.map( (song) => {
                 return (<div key={song.artist + song.title}>{song.artist}: {song.title}</div>)
             })}
         </div>
        );
    }
}

export default UserSongPage;