import React from "react";
import SpotifyAPI from "../api/SpotifyAPI";
import SongCatalog from "../util/SongCatalog";
import {Song} from "../types/SongType";
import SongContainer from "../components/SongContainer";
import {WithStyles, withStyles} from "@material-ui/core";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface UserSongProps extends WithStyles<typeof styles>, RouteComponentProps {

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
            .then(
                (topTracks: Song[]) => this.addFavoriteSongs(topTracks),
                () => {
                    this.props.history.push(
                        "/",
                        {
                            landingMessage: "Your session has expired. Click below to start again."
                        }
                    );
                }
            )

        this.spotifyAPI.songsFromPlaylists()
            .then(
                (playlistTracks: Song[]) => this.addFavoriteSongs(playlistTracks),
                () => {
                    this.props.history.push(
                        "/",
                        {
                            landingMessage: "Your session has expired. Click below to start again."
                        }
                    );
                }
            )
    }

    render() {
        const { classes } = this.props;
        return (
         <div className={classes.root}>
             <h4 className={classes.header}>
                 Your top songs:
             </h4>
             <div className={classes.songsContainer}>
                 {this.state.karaokeSongs.map( (song) => {
                     return (<SongContainer key={song.artist + song.title} song={song}/>)
                 })}
             </div>
             <h4 className={classes.header}>
                 Songs from your playlists:
             </h4>
         </div>
        );
    }
}


const styles = {
    root: {
        align: "center",
        width: "100%"
    },
    header: {
        fontFamily: "'Arima Madurai', cursive",
        fontSize: "2rem",
        textAlign: "center" as const,
        marginBottom: 0,
        color: "#FFFFFF"
    },
    songsContainer: {
        display: "flex",
        width: "100%",
        flexWrap: "wrap" as const,
        justifyContent: "center",
        padding: "2rem"
    }
}

export default withRouter( withStyles(styles)(UserSongPage) );