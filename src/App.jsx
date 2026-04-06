import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Editor from './pages/Editor.jsx'
import LogsTwo from './pages/Logs.jsx'
import Profile from './pages/Profile.jsx'
import Home from './pages/Home.jsx'
import About from './pages/AboutUs.jsx'
import { FAQ, Privacy, Terms, Licensing } from "./pages/LegalPages";
import Languages from './pages/Languages.jsx'
import {Careers, Ecosystem} from './pages/Career&Eco.jsx'
import Roadmap from './pages/Roadmap.jsx'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/logs" element={<LogsTwo />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/licensing" element={<Licensing />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/roadmap" element={<Roadmap />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
