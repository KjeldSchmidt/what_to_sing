import React from "react";
import SpotifyAPI, {SpotifySong} from "../api/SpotifyAPI";
import SongCatalog from "../util/SongCatalog";
import {Song} from "../types/SongType";

type UserSongProps = {

}

type UserSongState = {
    accessToken: string,
    songs: Song[],
}



class UserSongPage extends React.Component<UserSongProps, UserSongState> {
    private catalog: SongCatalog = new SongCatalog();

    constructor(props: UserSongProps) {
        super(props);
        const hashFragment = window.location.hash;
        const accessToken = hashFragment.slice(1).split('&')[0].split('=')[1];

        this.state = {
            songs: [],
            accessToken: accessToken,
        }
    }

    componentDidMount() {
        SpotifyAPI.topTracks(this.state.accessToken, 200)
            .then( (songs : SpotifySong[]) =>
                songs.map((song) => { return {title: song.name, artist: song.artists[0].name}})
            )
            .then( (songs: Song[]) => {
                const matches = this.catalog.findMatches(songs);
                this.setState({ songs: matches });
            })
    }

    render() {
        return (
         <div>
             Songs:
             {this.state.songs.map( (song) => {
                 return (<div key={song.artist + song.title}>{song.artist}: {song.title}</div>)
             })}
         </div>
        );
    }
}

export default UserSongPage;