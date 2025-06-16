require('dotenv').config();
const request = require('request')
const express = require('express')
const cors = require('cors')
const querystring = require('querystring')
const axios = require('axios')

const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express()
app.use(express.json());



app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));





app.get("/", (req, res) => {


    res.send("Hello")
});


app.use('/' , authRoutes); //handles login and access token request , redirects back to frontend
app.use('/',playlistRoutes); //handles playlist creation and selecting music for playlist




app.listen(5000)


