import React from "react";
import { useState, useEffect } from "react";
import '../stylesheets/Playlist.css'


import ImportCover from '../images/ImportCover.png';
import PlayButton from '../images/PlayButton.png'

function Playlist({ visible }) {

    return (
        <>
            <div className={`playlist-container ${visible ? "visible" : ""}`}>


                <div className="playlist-description">
                    <div className="playlist-image">
                        <img src={ImportCover} alt="Import Cover Image" />
                    </div>
                    <div className="playlist-details">
                        <p>Public Playlist</p>
                        <p><b>Playlist Name</b></p>
                        <p>Playlist Created using Trackify</p>
                        <p><b>Profile Name</b></p>
                        <p>10 songs , 1hr 2min</p>

                    </div>
                    <div className="playbutton">
                        <img src={PlayButton} alt="Play" />
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
                        <SongTab value={15}/>
                    </div>



                </div>


            </div>
        </>
    );
}


function SongTab({ value }) {
    const songs = Array.from({ length: value }, (_, i) => (
        <div key={i} className="song-tab">
            <div className="song-number">
                <p>{i + 1}</p>
                <div className="song-title-artist">
                    <div className="song-name">
                        <p><b>Dark Fantasy</b></p>
                    </div>
                    <div className="song-artist">
                        <p>Kanye West</p>
                    </div>
                </div>
            </div>
            <div className="song-duration">
                <p>03:30</p>
            </div>
        </div>
    ));

    return <>{songs}</>;
}


export default Playlist