import React from "react";
import { useState, useEffect } from "react";
import '../stylesheets/Playlist.css'


import ImportCover from '../images/ImportCover.png';
import PlayButton from '../images/PlayButton.png'

function Playlist({ visible, playlist }) {

    const [playlistName, setPlaylistName] = useState("Playlist Name");
    const [totalTracks, setTotalTracks] = useState(5);
    const [userName, setUserName] = useState("username");
    const [coverImage, setCoverImage] = useState("");
    const [tracks, setTracks] = useState([]);
    const [playlistDescription , setDescription] = useState("");
    const [visibility , setVisibility] = useState(true);

    useEffect(() => {
        if (playlist?.result) {
            const pl = playlist.result;
            //console.log(playlist);
            setPlaylistName(pl.name || "Playlist Name");
            setTotalTracks(pl.tracks?.total || 0);
            setUserName(pl.owner?.display_name || "username");
            setTracks(pl.tracks?.items);
            setDescription(pl.description);
            setVisibility(pl.public);
            //setCoverImage(playlist.images)
        }
    }, [playlist]);


    const thePlaylist = {
        name: playlistName,
        description: playlistDescription,
        total_tracks: totalTracks,
        username: userName,
        visibility: visibility

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
                        <SongTab items={tracks} />
                    </div>



                </div>


            </div>
        </>
    );
}


function SongTab({ items }) {
    console.log(items);


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