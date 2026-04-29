import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/AboutUs.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Languages from './pages/Languages.jsx'
import WebDev from './pages/WebDev.jsx'
import AppDev from './pages/AppDev.jsx'
import DataScience from './pages/DataScience.jsx'
import Logs from './pages/Logs.jsx'
import Glossary from './pages/Glossary.jsx'
import Snippets from './pages/Snippets.jsx'
import Blog from './pages/Blog.jsx';
import { FAQ, Privacy, Terms, Licensing } from "./pages/LegalPages";
import { Careers, Ecosystem } from './pages/Career&Eco.jsx'
import CJAIChat from "./components/CJAIChat";

import Layout from './components/Layout.jsx'
import AuthPage from './pages/Authpage.jsx'
import NotFound from './components/Notfound.jsx';

import { CJLoaderProvider, CJPageLoader } from "./components/Cjloader";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <CJLoaderProvider>
      <Router>

        <CJPageLoader />

        <Routes>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<Profile />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/licensing" element={<Licensing />} />
            <Route path="/tracks" element={<Languages />} />
            <Route path="/tracks/web" element={<WebDev />} />
            <Route path="/tracks/app" element={<AppDev />} />
            <Route path="/tracks/data" element={<DataScience />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/snippets" element={<Snippets />} />

            <Route path="*" element={<NotFound />} />
          </Route>

        </Routes>

        <CJAIChat isLoggedIn={!!user} />

      </Router>
    </CJLoaderProvider>
  );
}

export default App;