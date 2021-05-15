import React from "react";
import SpotifyAPI, {SpotifySong} from "../api/SpotifyAPI";
import SongCatalog from "../util/SongCatalog";
import {Song} from "../types/SongType";

type UserSongProps = {

}

type UserSongState = {
    accessToken: string,
    songs: Song[],
    karafunCatalog: SongCatalog
}



class UserSongPage extends React.Component<UserSongProps, UserSongState> {
    constructor(props: UserSongProps) {
        const hashFragment = window.location.hash;
        const accessToken = hashFragment.slice(1).split('&')[0].split('=')[1];
        super(props);

        this.state = {
            songs: [],
            accessToken: accessToken,
            karafunCatalog: new SongCatalog()
        }
    }

    componentDidMount() {
        SpotifyAPI.topTracks(this.state.accessToken)
            .then( (items : SpotifySong[]) => {
                const songs = items.map((item) => {
                    return {artist: item.artists[0].name, title: item.name}
                })

                this.setState({ songs:songs })
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