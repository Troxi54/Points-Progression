import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './components/PlayerContext.tsx'
import "./decimalExtensions.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider>
      <App/>
    </PlayerProvider>
  </StrictMode>,
)
