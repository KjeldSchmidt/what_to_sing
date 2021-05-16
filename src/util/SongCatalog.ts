import {catalog} from '../assets/karafun_catalog'
import {Song} from "../types/SongType";
import {SpotifyArtist} from "../api/SpotifyAPI";

export default class SongCatalog {
    private readonly songs: Song[]

    constructor() {
        this.songs = catalog.split('\n')
            .map((line) => line.split(';'))
            .map( ( splitLine ) => {
                return {
                    artist: splitLine[0],
                    title: splitLine[1]
                }
            });
    }

    hasSong( song: Song ): boolean {
        return this.songs
            .some( candidate => {
                return song.artist === candidate.artist && song.title === candidate.title
            });
    }

    findMatches( songs: Song[] ) : Song[] {
        return songs.filter((song) => this.hasSong(song));
    }

    findByArtists(artists: SpotifyArtist[]) : Song[] {
        const songs : Song[] = [];
        artists.forEach( artist => {
            const songsByArtist = this.songs.filter(song => {
                return artist.name === song.artist
            });

            songs.push(...songsByArtist);
        })

        return songs;
    }
}