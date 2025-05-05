
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root and render app - ensure React.StrictMode is properly used
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
