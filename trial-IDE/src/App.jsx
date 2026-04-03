import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Editor from './pages/Editor.jsx'
import LogsTwo from './pages/LogsTwo.jsx'
import Profile from './pages/Profile.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/logs2" element={<LogsTwo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
