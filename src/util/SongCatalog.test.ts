import SongCatalog from "./SongCatalog";
import {SpotifySong} from "../api/SpotifyAPI";

const testSong : SpotifySong = {
    album: {
        name: "",
        images: []
    },
    external_urls: {spotify: ""},
    id: "",
    popularity: 0,
    artists: [{
        name: "",
        id: ""
    }],
    name: ""
}

describe('SongCatalog', () => {
    const catalog = new SongCatalog();
    const realSong = {
        ...testSong,
        name: "A Fool For Your Stockings",
        artists: [{
            name: "ZZ Top",
            id: ""
        }],

    }
    it('should find an existing karafun song', () => {
        expect( catalog.hasSong(realSong) ).toBe(true)
    });

    it('should not find a made-up song', () => {
        const fakeSong = {
            ...testSong,
            artists: [{
                name: "AA Bottom",
                id: ""
            }],
            name: "An Idiot For Your Socks"
        }
        expect( catalog.hasSong(fakeSong) )
            .toBe(false)
    });
});