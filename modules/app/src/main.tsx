import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Design System tokens — importe AVANT index.css
import '@foundation-os/design-system/tokens.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
