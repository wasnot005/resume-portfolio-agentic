import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Preview from './pages/Preview'
import { RunStoreProvider } from './state/RunStore'
import { ApiKeyProvider } from './state/ApiKeyStore'

export default function App() {
  return (
    <RunStoreProvider>
      <ApiKeyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
        </BrowserRouter>
      </ApiKeyProvider>
    </RunStoreProvider>
  )
}
