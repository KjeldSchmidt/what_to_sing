import SongCatalog from "./SongCatalog";

describe('SongCatalog', () => {
    const catalog = new SongCatalog();

    it('should find an existing karafun song', () => {
        expect( catalog.hasSong({artist: "ZZ Top", title: "A Fool For Your Stockings"}) )
            .toBe(true)
    });

    it('should not find a made-up song', () => {
        expect( catalog.hasSong({artist: "AA Bottom", title: "An Idiot For Your Socks"}) )
            .toBe(false)
    });
});