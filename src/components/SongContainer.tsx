import React from "react";
import {Song} from "../types/SongType";
import {WithStyles, withStyles} from "@material-ui/core";
import colors from "../theme/colors";

interface SongContainerProps extends WithStyles<typeof styles> {
    song: Song,
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
        const { classes } = this.props;
        return <div className={classes.root}>
            <div>
                <div>{this.props.song.artist}</div>
                <div className={classes.title}>{this.props.song.title}</div>
            </div>
            <img
                className={classes.albumImage}
                src={this.props.song.albumArtUrl}
                alt="Album art for this song"
            />
        </div>;
    }
}

export default withStyles(styles)(SongContainer);