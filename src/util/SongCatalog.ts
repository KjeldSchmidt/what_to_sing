import {catalog} from '../assets/karafun_catalog'
import {Song} from "../types/SongType";

export default class SongCatalog {
    songs: Song[]

    constructor() {
        this.songs = catalog.split('\n')
            .map((line) => line.split(';'))
            .map( ( splitLine ) => {return {artist: splitLine[0], title: splitLine[1]}})

        console.dir(this.songs);
    }

    hasSong( song: Song ): boolean {
        return this.songs
            .filter((candidate) => candidate.artist === song.artist)
            .filter((candidate) => candidate.title === song.title )
            .length !== 0
    }
}