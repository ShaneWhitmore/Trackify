// © 2025 Shane Whitmore
// Licensed under the CC BY-NC 4.0 License.
// See LICENSE file for details.

require('dotenv').config();
const request = require('request')
const querystring = require('querystring')
const axios = require('axios')
const genreMap = require('../data/genreMap.js')

exports.createPlaylist = async (req, res) => {
    const { title, coverImage, visibility, genres, token } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Missing access token" });
    } else {


        // get current user logged in
        // https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile


        const profile = await fetchProfile(token);
        const user_name = profile.display_name;
        const user_id = profile.id;

        //step 1 create the playlist
        // https://developer.spotify.com/documentation/web-api/reference/create-playlist

        const playlist = await createPlaylist(user_id, token, title, visibility);


        //https://developer.spotify.com/documentation/web-api/reference/upload-custom-playlist-cover

        const coveredPlaylist = await uploadCoverImage(token, coverImage, playlist.id)


        //step 2 search recommended songs for each genre in genres 
        // https://developer.spotify.com/documentation/web-api/reference/get-recommendations

        const genreTopTracks = await getTopTracks(token, genres, genreMap)


        //Step 3 populate the playlist with the songs
        // https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
        const populatedPlaylist = await populatePlaylist(token, playlist.id, genreTopTracks);


        //Step 4 return the playlist information to the front end and populate "Playlist" Component
        const result = await getPlaylist(token, playlist.id);

        console.log(result);

        return res.json({ message: "New playlist", result });
    }
}


//https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback
exports.startPlayback = async (req, res) => {
    console.log("play has been requested");


    const { uri, token } = req.body;

    const play = await start(uri, token);
    return res.json(play);
}

async function start(uri, token) {
    const result = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            context_uri: uri
        })
    });

    console.log(result);
    console.log(result.status);

    return { status: result.status };

}


//https://developer.spotify.com/documentation/web-api/reference/pause-a-users-playback
exports.pausePlayback = async (req, res) => {

    console.log("pause has been requested");

    const { token } = req.body;

    const stop = await pause(token);
    return res.json(stop.status);

}

async function pause(token) {

    const result = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });


    console.log(result);

    return { status: result.status };


}


// fetch the currently signed in users profile (required to get the user id)
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}



//create a new playlist with the playlist information (name , public/private)
async function createPlaylist(user_id, token, title, visibility) {

    const result = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": title,
            "public": visibility,
            "description": "Created using Trackify.com",
        })
    });

    return await result.json();
}



async function uploadCoverImage(token, coverImage, playlist_id) {

    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/images`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "image/jpeg"
        },
        body: coverImage
    })


    return await result;
}



async function getTopTracks(token, genres, genreMap) {

    genres = Array.from(genres);

    //return 3 artists per genre selected
    const artistIDs = genres.flatMap(genre => {
        const formattedGenre = genre.trim().toLowerCase();
        const artist = genreMap[formattedGenre];


        if (!artist) {
            console.log(`could not find ${formattedGenre} in map`);

            return [];
        }

        const shuffled = artist.slice().sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);

        return selected.map(artist => artist.id);
    });


    //fetch artists top tracks for each artist in the artist List
    const trackPromises = artistIDs.map(async id => {
        const result = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await result.json();
        return data.tracks || [];
    });



    const allTracks = await Promise.all(trackPromises);
    const uris = allTracks.flat().map(track => track.uri);
    return shuffleArray(uris);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



async function populatePlaylist(token, playlist_id, genreTopTracks) {

    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "uris": genreTopTracks
        })
    });

    return await result.json();

}


async function getPlaylist(token, playlist_id) {

    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    return await result.json();
}