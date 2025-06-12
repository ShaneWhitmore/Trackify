import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Logo from './images/Logo.png'

import PlaylistForm from './components/PlaylistForm.jsx'
import Playlist from './components/Playlist.jsx'

import './App.css'

function App() {

  const [playlistVisible, setPlaylistVisible] = useState(false);

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
          <PlaylistForm onSubmitSuccess={() => setPlaylistVisible(true)} onCancel={() => setPlaylistVisible(false)} />
        </div>

        <div className='playlist'>
          <Playlist visible={playlistVisible} />
        </div>
      </div>


    </>

  )
}



export default App
