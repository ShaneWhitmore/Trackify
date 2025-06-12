require('dotenv').config();
const request = require('request')
const querystring = require('querystring')
const axios = require('axios')


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

        const playlist = await createPlaylist(user_id, token, req.body);
        console.log(playlist)


        //step 2 search recommended songs for each genre in genres 
        // https://developer.spotify.com/documentation/web-api/reference/get-recommendations




        //Step 3 populate the playlist with the songs
        // https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist





        //Step 4 return the playlist information to the front end and populate "Playlist" Component





        return res.json({ message: "Received playlist data successfully", title });
    }
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


async function createPlaylist(user_id, token, playlistInfo) {

    const result = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: playlistInfo.title,
            public: playlistInfo.visibility,
            description: "Created using Trackify.com",
        })
    });

    return await result.json();
}