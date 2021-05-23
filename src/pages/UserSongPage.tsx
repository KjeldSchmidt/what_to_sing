import React from "react";
import SpotifyAPI, {SpotifyArtist} from "../api/SpotifyAPI";
import SongCatalog from "../util/SongCatalog";
import {Song} from "../types/SongType";
import SongContainer from "../components/SongContainer";
import {WithStyles, withStyles} from "@material-ui/core";
import {RouteComponentProps, withRouter} from "react-router-dom";
import ArtistContainer from "../components/ArtistContainer";

interface UserSongProps extends WithStyles<typeof styles>, RouteComponentProps {

}

type UserSongState = {
    checkedSongs: Song[],
    topAvailableSongs: Song[],
    playlistAvailableSongs: Song[],
    artistAvailableSongs: Map<SpotifyArtist, Song[]>,
}

class UserSongPage extends React.Component<UserSongProps, UserSongState> {
    private catalog: SongCatalog = new SongCatalog();
    private readonly spotifyAPI : SpotifyAPI | null = null;

    constructor(props: UserSongProps) {
        super(props);
        const hashFragment = window.location.hash;
        const accessToken = hashFragment.slice(1).split('&')[0].split('=')[1];

        if ( accessToken === undefined ) {
            this.props.history.push(
                "/",
                {
                    landingMessage: "Authorisation failed. Please try again?"
                }
            );
        } else {
            this.spotifyAPI = new SpotifyAPI(accessToken);
        }

        this.state = {
            checkedSongs: [],
            topAvailableSongs: [],
            playlistAvailableSongs: [],
            artistAvailableSongs: new Map<SpotifyArtist, Song[]>()
        }
    }

    addTopSongs(songs: Song[] ) : void {
        const {newFavorite, newKaraoke} = this.extractNew(songs);

        this.setState({
            checkedSongs: [...this.state.checkedSongs, ...newFavorite],
            topAvailableSongs: [...this.state.topAvailableSongs, ...newKaraoke],
        });
    }

    addPlaylistSongs(songs: Song[] ) : void {
        const {newFavorite, newKaraoke} = this.extractNew(songs);

        this.setState({
            checkedSongs: [...this.state.checkedSongs, ...newFavorite],
            playlistAvailableSongs: [...this.state.playlistAvailableSongs, ...newKaraoke],
        });
    }

    private addFromArtists(artists: SpotifyArtist[]) {
        const songsByArtist = this.catalog.findByArtists(artists);

        this.state.artistAvailableSongs.forEach((songs, artist) => {
            if (!songsByArtist.has(artist)) {
                songsByArtist.set(artist, songs);
            }
        });

        this.setState({
            artistAvailableSongs: songsByArtist,
        });
    }

    private extractNew(songs: Song[]) {
        const newFavorite: Song[] = [];
        songs.forEach(song => {
            const entryExists = this.state.checkedSongs
                .some(candidate => {
                    return song.artist === candidate.artist && song.title === candidate.title
                });

            if (!entryExists) {
                newFavorite.push(song)
            }
        });

        const newKaraoke = this.catalog.findMatches(newFavorite);
        return {newFavorite, newKaraoke};
    }


    componentDidMount() {
        if (this.spotifyAPI === null) return;

        const onNotAuthorized = (reason : unknown) => {
            console.dir(reason);
            this.props.history.push(
                "/",
                {
                    landingMessage: "Your session has expired. Click below to start again."
                }
            );
        };

        this.spotifyAPI.topTracks()
            .then(
                (topTracks: Song[]) => this.addTopSongs(topTracks),
                reason => onNotAuthorized(reason)
            )

        this.spotifyAPI.songsFromPlaylists()
            .then(
                (playlistTracks: Song[]) => this.addPlaylistSongs(playlistTracks),
                reason => onNotAuthorized(reason)
            )

        this.spotifyAPI.topArtists()
            .then(
                artists => this.addFromArtists(artists),
                reason => onNotAuthorized(reason)
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
                 {this.state.topAvailableSongs.map( (song) => {
                     return (<SongContainer key={song.artist + song.title} song={song}/>)
                 })}
             </div>

             <h4 className={classes.header}>
                 Songs from your playlists:
             </h4>
             <div className={classes.songsContainer}>
                 {this.state.playlistAvailableSongs.map( (song) => {
                     return (<SongContainer key={song.artist + song.title} song={song}/>)
                 })}
             </div>

             <h4 className={classes.header}>
                 Other songs by your top artists:
             </h4>
             <div className={classes.artistsContainer}>
                 {Array.from( this.state.artistAvailableSongs ).map( ([artist, songs]) => {
                     return (<ArtistContainer key={artist.name} artist={artist} songs={songs}/>)
                 })}
             </div>
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
    },
    artistsContainer: {
        margin: "2rem"
    }
}

export default withRouter( withStyles(styles)(UserSongPage) );