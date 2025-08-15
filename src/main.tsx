import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Today from './pages/Today'
import History from './pages/History'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Today /> },
    { path: 'history', element: <History /> },
    { path: 'settings', element: <Settings /> },
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
