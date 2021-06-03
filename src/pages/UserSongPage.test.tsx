import {mount, configure} from 'enzyme';
import UserSongPage from "./UserSongPage";
import React from "react";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Router } from 'react-router-dom';
jest.mock('../api/SpotifyAPI');
import SpotifyAPI, {SpotifySong} from "../api/SpotifyAPI";
import { createMemoryHistory } from 'history'
import SongContainer from "../components/SongContainer";

configure({adapter: new Adapter()});

const flushPromises = () => new Promise(setImmediate);

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

describe('UserSongPage', () => {

    it('should redirect to landing page with error message when no access token is provided', () => {
        const history = createMemoryHistory({
            initialEntries: ['/authorisation_callback?error=testerror']
        });
        const historySpy = jest.spyOn(history, 'push');
        mount(
            <Router history={history}>
                <UserSongPage />
            </Router>
        );
        expect(historySpy).toHaveBeenCalledWith(
            "/", { landingMessage: "Authorisation failed. Please try again?" }
        );
    });

    it('should show a song only once, even if it occurs in two seperate playlists', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/authorisation_callback#access_token=testToken']
        });

        const realSong = {
            ...testSong,
            name: "A Fool For Your Stockings",
            artists: [{
                name: "ZZ Top",
                id: ""
            }],
        };

        SpotifyAPI.mockImplementation( () => {
            return {
                topTracks: () => Promise.resolve([]),
                songsFromPlaylists: () => Promise.resolve([realSong, realSong]),
                topArtists: () => Promise.resolve([]),
                savedSongs: () => Promise.resolve([]),
            }
        })

        const wrapper = mount(
            <Router history={history}>
                <UserSongPage />
            </Router>
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.find(SongContainer)).toHaveLength(1);
    });
});

