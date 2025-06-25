// © 2025 Shane Whitmore
// Licensed under the CC BY-NC 4.0 License.
// See LICENSE file for details.

import React from "react";
import { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import axios from 'axios';

import '../stylesheets/PlaylistForm.css';
import ImportCover from '../images/ImportCover.png';
import PrivateIcon from '../images/PrivateIcon.png'
import PublicIcon from '../images/PublicIcon.png'


function PlaylistForm(props) {
    const [title, setTitle] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [preview, setPreview] = useState(ImportCover);
    const [base64Image, setBase64Image] = useState(null);




    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64Data = reader.result.split(',')[1];
                setPreview(reader.result);
                setBase64Image(base64Data);


                console.log("Full Data URL:", reader.result); // includes mime type
                console.log("Base64 only:", (base64Data.length)); // base64 image only
            };

            reader.readAsDataURL(file);
        }
    };


    function clearForm() {
        setTitle("");
        setIsPrivate(false);
        setSelectedGenres(new Set());
        setPreview(ImportCover);
        props.onCancel();
    }

    async function submitForm() {

        //playlist title must be populated for playlist to be created
        if (title === "") {
            window.alert("Please provide a title for the playlist")
        }
        else if (selectedGenres.size === 0) {
            window.alert("Please provide at least ONE Genre of Music (Max. 5)")

        }
        else if (selectedGenres.size > 5) {
            window.alert("Please provide between 1 - 5 Genres of Music")
        }
        else {
            try {
                const token = localStorage.getItem("spotify_token");
                if (!token) {
                    window.alert("Missing Spotify token. Please log in again.");
                    return;
                }

                const req = await axios.post("http://localhost:5000/createPlaylist", {
                    title: title,
                    coverImage: base64Image,
                    visibility: !isPrivate,
                    genres: Array.from(selectedGenres),
                    token: token,
                });



                const newPlaylist = req.data;
                console.log(newPlaylist);

                props.onSubmitSuccess(newPlaylist);
            } catch (error) {
                console.error("Failed to create playlist:", error);
                window.alert("An error occurred while creating the playlist.");
            }

        }


    }


    const toggleGenre = (name) => {
        const newSet = new Set(selectedGenres);
        if (newSet.has(name)) {
            newSet.delete(name);
        } else {
            newSet.add(name);
        }
        setSelectedGenres(newSet);
    };

    return (

        <div className="form">
            <div className="playlist-info">
                <div className="playlist-title">

                    <div className="title-field">
                        <TextField id="standard-basic" label="Playlist Title" variant="standard"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{
                                input: {
                                    color: 'white',
                                },
                                label: {
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: '#00A3FF',
                                    },
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#00A3FF',
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottomColor: '#1ED760',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: '#00A3FF',
                                },
                            }} />
                    </div>

                    <div className="visibility">
                        <VisibilityToggle isPrivate={isPrivate} setIsPrivate={setIsPrivate} />
                    </div>
                </div>
                <div className="playlist-cover">
                    <label htmlFor="image-upload">
                        <img
                            src={preview || 'https://via.placeholder.com/200'}
                            alt="Import Cover"
                            className="upload-image"
                        />
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>


            <GenreSection
                title="Genres"
                genres={["Rock", "Pop", "Rap", "Jazz", "Reggae", "EDM"]}
                toggleGenre={toggleGenre}
                selectedGenres={selectedGenres}
            />
            <GenreSection
                title="Other"
                genres={["Like My Top 5", "Summer Vibes", "Road Trip", "Christmas"]}
                toggleGenre={toggleGenre}
                selectedGenres={selectedGenres}
            />

            <div className="submission">
                <div className="divider" />
                <SubmitCancelButtons onSubmit={submitForm} onClear={clearForm} />
            </div>

        </div>

    );


}


function VisibilityToggle({ isPrivate, setIsPrivate }) {

    return (
        <button
            className={`vis-btn ${isPrivate ? "Private" : "Public"}`}
            onClick={() => setIsPrivate(!isPrivate)}
        >
            <div className="thumb" >
                <img src={isPrivate ? PrivateIcon : PublicIcon} alt={isPrivate ? "Private" : "Public"} />
            </div>
        </button>
    );
}


function GenreSection({ title, genres, toggleGenre, selectedGenres }) {
    return (
        <div className="genre-selection">
            <div className="genre-title">
                <p>{title}</p>
                <div className="divider" />
            </div>
            <div className="genre-buttons">
                {genres.map((g) => (
                    <GenreButton
                        key={g}
                        name={g}
                        selected={selectedGenres.has(g)}
                        onToggle={() => toggleGenre(g)}
                    />
                ))}
            </div>
        </div>
    );
}

function GenreButton({ name, selected, onToggle }) {
    return (
        <button
            className={`genreButton ${selected ? 'selected' : 'notselected'}`}
            onClick={onToggle}
        >
            {name}
        </button>
    );
}


function SubmitCancelButtons({ onSubmit, onClear }) {

    return (
        <div className="submission-buttons">
            <button className="cancel-button" onClick={onClear}>
                <b>Cancel</b>
            </button>

            <button className="submit-button" onClick={onSubmit}>
                <b>Submit</b>
            </button>
        </div>

    );
}






export default PlaylistForm