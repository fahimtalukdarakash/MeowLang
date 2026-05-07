import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { tokenUtils } from './utils/token.utils'

// Apply correct theme on initial load
if (tokenUtils.getToken()) {
    document.documentElement.setAttribute('data-theme', 'app')
    document.body.style.backgroundColor = '#F5F5DC'
}

createRoot(document.getElementById('root')!).render(
    <App />
)