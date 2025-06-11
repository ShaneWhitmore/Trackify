require('dotenv').config();
const request = require('request')
const express = require('express')
const querystring = require('querystring')
const axios = require('axios')

const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express()

app.get("/", (req, res) => {


    res.send("Hello")
});


app.use('/' , authRoutes); //handles login and access token request , redirects back to frontend
app.use('/',playlistRoutes);




app.listen(5000)


