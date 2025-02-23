import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import logo from "./assets/image.png";
export default function NotFoundPage() {
  const navigate = useNavigate();
  const calculatePositions = () => {
    // Create a more interesting, winding path through the tech city
    // Working with a grid system for better organization
    const basePositions = [
      { x: 150, y: 220 },
      { x: 320, y: 180 },
      { x: 480, y: 260 },
      { x: 620, y: 180 },
      { x: 780, y: 240 },
      { x: 880, y: 340 },
      { x: 780, y: 420 },
      { x: 620, y: 480 },
      { x: 460, y: 410 },
      { x: 340, y: 500 },
      { x: 220, y: 580 },
      { x: 350, y: 660 },
      { x: 520, y: 620 },
      { x: 680, y: 680 },
      { x: 820, y: 600 },
      { x: 950, y: 540 },
      { x: 1050, y: 460 },
      { x: 1150, y: 380 },
      { x: 1220, y: 280 },
      { x: 1350, y: 220 },
    ];

    return basePositions;
  };

  const positions = calculatePositions();
  const svgWidth = Math.max(...positions.map((p) => p.x)) + 200;
  const svgHeight = Math.max(...positions.map((p) => p.y)) + 120;
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll(".city-glow").forEach((el) => {
        const newOpacity = 0.3 + Math.random() * 0.3;
        const newBlur = 10 + Math.random() * 10;
        el.style.opacity = newOpacity;
        el.style.filter = `blur(${newBlur}px)`;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Futuristic tech sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 overflow-hidden">
        {/* Distant skyline silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-gray-900 opacity-60"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,250 L50,240 L80,190 L110,230 L140,210 L180,180 L220,240 L270,220 L300,200 L320,230 L350,210 L380,190 L420,240 L460,200 L490,230 L520,210 L550,190 L590,220 L630,230 L660,210 L690,200 L720,240 L750,220 L790,180 L830,240 L870,210 L910,230 L940,200 L980,220 L1020,240 L1050,190 L1080,210 L1110,230 L1140,200 L1170,240 L1200,250 L1200,300 L0,300 Z' fill='%23111827'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Glowing city elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`citylight-${i}`}
            className="city-glow absolute rounded-full transition-all duration-2000"
            style={{
              width: 20 + Math.random() * 100,
              height: 20 + Math.random() * 100,
              // Use full viewport height/width for positioning
              top: Math.random() * window.innerHeight,
              left: Math.random() * window.innerWidth,
              background: `radial-gradient(circle, ${
                [
                  "rgba(59,130,246,0.5)",
                  "rgba(139,92,246,0.5)",
                  "rgba(6,182,212,0.5)",
                  "rgba(16,185,129,0.5)",
                ][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              opacity: 0.3 + Math.random() * 0.3,
              filter: `blur(${20 + Math.random() * 15}px)`,
            }}
          />
        ))}

        {/* Grid lines for a tech feel */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            opacity: 0.5,
          }}
        ></div>
      </div>

      {/* Fixed futuristic header */}
      <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-md border-b border-cyan-500/30">
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
                <img
                  src={logo}
                  alt="BitVoyager logo"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                <span className="font-extrabold">BIT</span>
                <span className="text-xl ml-1 font-light">VOYAGER</span>
              </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center">
              <ul className="flex gap-8 text-sm font-medium">
                {["Home", "About", "Courses"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 py-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main 404 content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h2 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
          404
        </h2>
        <p className="mt-4 text-xl text-gray-300">Page Not Found</p>
        <p className="mt-2 text-gray-500 py-2">
          The path you are looking for does not exist (yet at least).
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-2 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded border border-cyan-500/30 font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
