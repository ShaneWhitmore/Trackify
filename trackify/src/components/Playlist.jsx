// © 2025 Shane Whitmore
// Licensed under the CC BY-NC 4.0 License.
// See LICENSE file for details.

import React from "react";
import { useState, useEffect } from "react";
import '../stylesheets/Playlist.css'
import axios from 'axios';


import ImportCover from '../images/ImportCover.png';
import PlayButton from '../images/PlayButton.png';
import PauseButton from '../images/PauseButton.png';

function Playlist({ visible, playlist }) {

    const [playlistName, setPlaylistName] = useState("Playlist Name");
    const [totalTracks, setTotalTracks] = useState(5);
    const [userName, setUserName] = useState("username");
    const [coverImage, setCoverImage] = useState("");
    const [tracks, setTracks] = useState([]);
    const [playlistDescription, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [runPlayback, setRunPlayback] = useState(false);
    const [playlistURI, setPlaylistURI] = useState("");

    useEffect(() => {
        if (playlist?.result) {
            const pl = playlist.result;
            setPlaylistName(pl.name || "Playlist Name");
            setTotalTracks(pl.tracks?.total || 0);
            setUserName(pl.owner?.display_name || "username");
            setTracks(pl.tracks?.items);
            setDescription(pl.description);
            setVisibility(pl.public);
            setPlaylistURI(pl.uri);
            //setCoverImage(playlist.images)
        }
    }, [playlist]);


    const thePlaylist = {
        name: playlistName,
        description: playlistDescription,
        total_tracks: totalTracks,
        username: userName,
        visibility: visibility,
        uri: playlistURI

    }

    const handlePlayButton = async () => {
        const newState = !runPlayback;

        const token = localStorage.getItem("spotify_token");
        if (!token) {
            window.alert("Missing Spotify token. Please log in again.");
            return;
        }

        try {
            if (newState) {
                //play playback
                //take the uri of the playlist and user token and send to backend
                const req = await axios.put("http://localhost:5000/startPlayback", {
                    uri: playlistURI,
                    token: token,

                });

                console.log(req);

                if(req.status === 200)
                {
                    setRunPlayback(newState);
                }

                console.log(req);
            } else {
                //pause playback uri
                // take uri of playlist and user token and send to backend
                const req = await axios.put("http://localhost:5000/pausePlayback", {
                    token: token,
                });

                console.log(req);

                if(req.data === 200)
                {
                    setRunPlayback(newState);
                }
            }


        } catch (error) {
            console.log("Failed to pause playback", error)
        }
    }


    return (
        <>
            <div className={`playlist-container ${visible ? "visible" : ""}`}>


                <div className="playlist-description">
                    <div className="playlist-image">
                        <img src={ImportCover} alt="Cover Image" />
                    </div>
                    <div className="playlist-details">
                        <p>{thePlaylist.visibility ? "Public" : "Private"} Playlist</p>
                        <p><b>{thePlaylist.name}</b></p>
                        <p>{thePlaylist.description}</p>
                        <p><b>{thePlaylist.username}</b></p>
                        <p>{thePlaylist.total_tracks} songs</p>

                    </div>
                    <div className="playbutton" onClick={() => handlePlayButton()}>
                        <img src={runPlayback ? PauseButton : PlayButton} alt="Play" />
                    </div>
                </div>




                <div className="playlist-songs">

                    <div className="column-icons">

                        <div className="icons">
                            <div className="artist">
                                <p>#</p>
                                <p>Title</p>
                            </div>

                            <p>Duration</p>
                        </div>
                        <div className="divider" />
                    </div>

                    <div className="songs-list">
                        <SongTab items={tracks} />
                    </div>



                </div>


            </div>
        </>
    );
}


function SongTab({ items }) {
    const songs = items.map((item, i) => {
        const track = item.track;
        const trackName = track.name;
        const artist = track.artists[0]?.name;
        const duration = track.duration_ms; //duration_ms: 208240
        const durationMin = Math.floor(duration / 60000);
        const durationSec = Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0');


        return (
            <div key={i} className="song-tab">
                <div className="song-number">
                    <p>{i + 1}</p>
                    <div className="song-title-artist">
                        <div className="song-name">
                            <p><b>{trackName}</b></p>
                        </div>
                        <div className="song-artist">
                            <p>{artist}</p>
                        </div>
                    </div>
                </div>
                <div className="song-duration">
                    <p>{durationMin}:{durationSec}</p>
                </div>
            </div>
        );
    });

    return <>{songs}</>;

}


export default Playlist