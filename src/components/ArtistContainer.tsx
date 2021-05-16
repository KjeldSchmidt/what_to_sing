import React from "react";
import {Song} from "../types/SongType";
import {WithStyles, withStyles} from "@material-ui/core";
import colors from "../theme/colors";
import {SpotifyArtist} from "../api/SpotifyAPI";

interface ArtistContainerProps extends WithStyles<typeof styles> {
    songs: Song[],
    artist: SpotifyArtist
}
type ArtistContainerState = Record<string, never>

const styles = {
    root: {
        border: "1px solid black",
        borderRadius: 3,
        background: colors.objectBackground,
        maxWidth: 400,
        padding: "0.5rem",
        margin: "3px auto",
        textAlign: "center" as const
    },
    title: {
        fontSize: "1.5rem"
    }
}

class ArtistContainer extends React.Component<ArtistContainerProps, ArtistContainerState>{
    render() {
        const { classes } = this.props;
        return <div className={classes.root}>
            <div>
                <div className={classes.title}>{this.props.artist.name}</div>
            </div>
            <div>
                {this.props.songs.map( (song) => {
                    return (<div>{song.title}</div>)
                })}
            </div>
        </div>;
    }
}

export default withStyles(styles)(ArtistContainer);