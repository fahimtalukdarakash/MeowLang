// File: src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { tokenUtils } from './utils/token.utils'

// Apply correct theme on initial load
// If user is already logged in, show light CMS theme
if (tokenUtils.getToken()) {
    document.documentElement.setAttribute('data-theme', 'light')
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)