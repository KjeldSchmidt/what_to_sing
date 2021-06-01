import React from "react";
import {WithStyles, withStyles} from "@material-ui/core";
import colors from "../theme/colors";
import {SpotifySong} from "../api/SpotifyAPI";

interface SongContainerProps extends WithStyles<typeof styles> {
    song: SpotifySong,
}
type SongContainerState = Record<string, never>

const styles = {
    root: {
        border: "1px solid black",
        borderRadius: 3,
        background: colors.objectBackground,
        width: 400,
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem",
        margin: 3,
        alignItems: "center"
    },
    title: {
        fontSize: "1.5rem"
    },
    albumImage: {
        width: 64,
        height: 64
    }
}

class SongContainer extends React.Component<SongContainerProps, SongContainerState>{
    render() {
        const images = this.props.song.album.images;
        let imageUrl = null;
        if (images.length !== 0 ) {
            imageUrl = images[ images.length - 1].url;
        }
        const { classes } = this.props;
        return <div className={classes.root}>
            <div>
                <div>{this.props.song.artists[0].name}</div>
                <div className={classes.title}>{this.props.song.name}</div>
            </div>
            { imageUrl &&
                <img
                    className={classes.albumImage}
                    src={imageUrl}
                    alt="Album art for this song"
                />
            }
        </div>;
    }
}

export default withStyles(styles)(SongContainer);