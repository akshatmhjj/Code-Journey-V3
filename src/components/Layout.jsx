/**
 * CJ App Layout — wires the sticky-behind footer effect
 *
 * ─── HOW THE PARALLAX REVEAL WORKS ────────────────────────────
 *
 * The trick is CSS layering + stacking context:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  <body>  (no overflow: hidden)               │
 *   │                                              │
 *   │  ┌─────────────────────────────────┐         │
 *   │  │  .content-wrapper               │ z: 1   │
 *   │  │  position: relative             │        │
 *   │  │  background: var theme color    │        │
 *   │  │  (covers the footer below it)   │        │
 *   │  │                                 │        │
 *   │  │  <Header />                     │        │
 *   │  │  <main>{children}</main>        │        │
 *   │  └─────────────────────────────────┘         │
 *   │                                              │
 *   │  <Footer />                                  │
 *   │  position: sticky; bottom: 0; z-index: 0    │
 *   │  (sits behind the content wrapper)           │
 *   │                                              │
 *   └──────────────────────────────────────────────┘
 *
 * As the user scrolls, the content wrapper scrolls UP and its
 * bottom edge eventually clears the footer — revealing the
 * footer underneath like pulling a card out from behind.
 *
 * KEY REQUIREMENTS:
 * 1. Footer must be OUTSIDE and AFTER the content wrapper
 * 2. Content wrapper needs a background (so it visually hides footer)
 * 3. Content wrapper needs position:relative + z-index > footer's z-index
 * 4. No overflow:hidden on <html> or <body>
 * ──────────────────────────────────────────────────────────────
 */

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

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

      {/*
        CONTENT WRAPPER
        ────────────────
        - position: relative  → creates stacking context
        - z-index: 1          → sits above the sticky footer (z-index: 0)
        - background          → MUST match your page background so it
                                visually covers the footer beneath it
                                while scrolling
      */}
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
          {children}
        </main>
      </div>

      {/*
        FOOTER — sits here, OUTSIDE the content wrapper
        position: sticky + bottom: 0 + z-index: 0
        The content wrapper scrolls over it.
      */}
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
 *   This still works with this Layout — Profile overrides
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