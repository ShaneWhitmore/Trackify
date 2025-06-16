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
        const user_id = profile.id;






        //step 1 create the playlist
        // https://developer.spotify.com/documentation/web-api/reference/create-playlist

        const playlist = await createPlaylist(user_id, token, title, visibility);
        //console.log(playlist);


        //step 2 search recommended songs for each genre in genres 
        // https://developer.spotify.com/documentation/web-api/reference/get-recommendations

        const genreTopTracks = await getTopTracks(token, genres, genreMap)
        //console.log(genreRecommendations)


        //Step 3 populate the playlist with the songs
        // https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
        const populatedPlaylist = await populatePlaylist(token, playlist.id, genreTopTracks);
        console.log(populatedPlaylist);



        //Step 4 return the playlist information to the front end and populate "Playlist" Component





        return res.json({ message: "Received playlist data successfully", title });
    }
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
            "description": "Created using Trackify.com",
            "public": visibility
        })
    });

    return await result.json();
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
        const selected = shuffled.slice(0, 2);

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
    const tracks = allTracks[0];
    const uris = tracks.map(track => track.uri);


    console.log(uris);
    return uris.flat();
}


async function populatePlaylist(token, playlist_id, genreTopTracks) {

    //console.log(genreTopTracks);

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