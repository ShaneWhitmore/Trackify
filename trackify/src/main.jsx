// © 2025 Shane Whitmore
// Licensed under the CC BY-NC 4.0 License.
// See LICENSE file for details.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
