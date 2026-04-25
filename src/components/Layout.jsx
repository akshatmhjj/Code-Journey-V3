import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  // Read current theme background so the content wrapper covers the footer
  const getShellBg = () => {
    try {
      const key = localStorage.getItem("cj-theme") || "cosmos";
      const map = {
        cosmos: "#07080d",
        void:   "#000000",
        aurora: "#040e0e",
        nord:   "#1a1f2e",
        light:  "#f3f4f8",
      };
      return map[key] || "#07080d";
    } catch {
      return "#07080d";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        id="cj-content"
        style={{
          position: "relative",
          zIndex: 1,
          background: getShellBg(),
          minHeight: "100vh",
        }}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />

    </div>
  );
}

/*
 * ─── USAGE IN App.jsx / main router ──────────────────────────
 *
 *   import Layout from "./components/Layout";
 *
 *   function App() {
 *     return (
 *       <Layout>
 *         <Routes>
 *           <Route path="/"        element={<Home />}    />
 *           <Route path="/login"   element={<Login />}   />
 *           <Route path="/profile" element={<Profile />} />
 *           ...etc
 *         </Routes>
 *       </Layout>
 *     );
 *   }
 *
 * ─── NOTE ON PROFILE PAGE ─────────────────────────────────────
 *
 *   Profile.jsx hides header/footer with:
 *     document.querySelector("header").style.display = "none"
 *     document.querySelector("footer").style.display = "none"
 *
 *   This still works with this Layout - Profile overrides
 *   visibility on mount and restores it on unmount.
 *   Alternatively, you can pass a prop to Layout:
 *
 *   <Layout hideChrome={true}>
 *     <Profile />
 *   </Layout>
 *
 *   And in Layout:
 *     {!hideChrome && <Header />}
 *     ...
 *     {!hideChrome && <Footer />}
 */