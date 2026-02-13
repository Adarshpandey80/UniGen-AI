import React from 'react'
import Layout from './Layout'
import Text from './pages/Text'
import Image from './pages/Image'
import Video from './pages/Video'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Text />} />
            <Route path='/image' element={<Image />} />
            <Route path='/video' element={<Video />} />
            <Route path='/chatpage' element={<ChatPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

