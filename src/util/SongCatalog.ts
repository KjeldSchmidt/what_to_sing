import {catalog} from '../assets/karafun_catalog'
import {Song} from "../types/SongType";
import {SpotifyArtist, SpotifySong} from "../api/SpotifyAPI";

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

    hasSong( song: SpotifySong ): boolean {
        return this.songs
            .some( candidate => {
                return song.artists[0].name === candidate.artist && song.name === candidate.title
            });
    }

    findMatches( songs: SpotifySong[] ) : SpotifySong[] {
        return songs.filter((song) => this.hasSong(song));
    }

    findByArtists(artists: SpotifyArtist[]) : Map<SpotifyArtist, Song[]> {
        const songMap = new Map<SpotifyArtist, Song[]>();

        if ( !artists ) return songMap;

        artists.forEach( artist => {
            const songsByArtist = this.songs.filter(song => {
                return artist.name === song.artist
            });

            if (songsByArtist.length !== 0 ) {
                songMap.set(artist, songsByArtist);
            }
        })

        return songMap
    }
}