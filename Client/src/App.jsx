import React from 'react'
import Layout from './Layout'
import ChatPage from './pages/ChatPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


