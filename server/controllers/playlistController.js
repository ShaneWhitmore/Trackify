require('dotenv').config();
const request = require('request')
const querystring = require('querystring')
const axios = require('axios')


exports.createPlaylist = (req, res) => {
    const { title, coverImage, visibility, genres, token } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Missing access token" });
    }

    

    //step 1 create the playlist

        // https://developer.spotify.com/documentation/web-api/reference/create-playlist




    //step 2 search recommended songs for each genre in genres 

        // https://developer.spotify.com/documentation/web-api/reference/get-recommendations


    //Step 3 populate the playlist with the songs

        // https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist



        

    //Step 4 return the playlist information to the front end and populate "Playlist" Component





    return res.json({ message: "Received playlist data successfully", title });

}





