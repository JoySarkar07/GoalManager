/**
 * External dependencies
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/**
 * Internal dependencies
 */
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
