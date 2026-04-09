import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Design System tokens (CSS vars --fos-*) — doit etre importe AVANT index.css
// pour que ce dernier puisse overrider si besoin (pas le cas actuellement).
import '@foundation-os/design-system/tokens.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
