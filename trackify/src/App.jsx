// © 2025 Shane Whitmore
// Licensed under the CC BY-NC 4.0 License.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react'
import Logo from './images/Logo.png'

import PlaylistForm from './components/PlaylistForm.jsx'
import Playlist from './components/Playlist.jsx'

import './App.css'

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [playlist, setPlaylist] = useState(null);

  const handleNewPlaylist = (newPlaylist) => {
    setPlaylist(newPlaylist)
  }

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        localStorage.setItem("spotify_token", token);
        window.history.pushState("", document.title, window.location.pathname);
      }

    }
  }, []);

  return (
    <>
      <div className='head'>
        <img src={Logo} alt="Trackify" className='logo' />

        <a href='http://127.0.0.1:5000/login' ><b>Log in</b></a>
      </div>

      <div className='content'>
        <div className='playlist-form'>
          <PlaylistForm onSubmitSuccess={(newPlaylist) => {
            setIsVisible(true);
            handleNewPlaylist(newPlaylist);

            console.log(newPlaylist);
          }} onCancel={() => setIsVisible(false)} />

          
        </div>

        <div className='playlist'>
          <Playlist visible={isVisible} playlist={playlist} />
        </div>
      </div>


    </>

  )
}



export default App
