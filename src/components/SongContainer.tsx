import React from "react";
import {Song} from "../types/SongType";
import {withStyles} from "@material-ui/core";

type SongContainerProps = {
    song: Song,
    classes: any,
}
type SongContainerState = {}

const styles = {
    root: {
        border: "1px solid black",
        background: "#44444A",
        width: 400,
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem",
        margin: 3,
    },
    title: {
        fontSize: "1.5rem"
    }
}

class SongContainer extends React.Component<SongContainerProps, SongContainerState>{
    render() {
        const { classes } = this.props;
        return <div className={classes.root}>
            <div>
                <div className={classes.artist}>{this.props.song.artist}</div>
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