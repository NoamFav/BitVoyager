import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import logo from "./assets/image.png";
import bash from "./assets/bash.png";
import python from "./assets/python.png";
import javascript from "./assets/javascript.png";
import java from "./assets/java.png";
import cpp from "./assets/c++.png";
import rust from "./assets/rust.png";
import noam from "./assets/noam.png";
import mathieu from "./assets/mathieu.png";

function Home() {
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [hoveredTeacher, setHoveredTeacher] = useState(null);

  const languages = ["Bash", "Python", "Rust", "C++", "JavaScript", "Java"];
  const description = {
    Bash: "Automate tasks and manage your system right from the command line—like a power user.",
    Python:
      "A beginner-friendly, high-level language beloved for data science, web apps, and more.",
    JavaScript:
      "The go-to language for creating interactive websites and dynamic web applications.",
    Java: "A tried-and-true language powering Android apps and countless enterprise solutions worldwide.",
    "C++":
      "The powerhouse behind high-performance software, games, and system-level development.",
    Rust: "A modern, memory-safe language built for speed, reliability, and concurrent programming.",
  };

  // Animation for the background glow effects
  useEffect(() => {
    const interval = setInterval(() => {
      const glows = document.querySelectorAll(".city-glow");
      glows.forEach((glow) => {
        const newOpacity = 0.3 + Math.random() * 0.3;
        const newBlur = 20 + Math.random() * 15;
        glow.style.opacity = newOpacity;
        glow.style.filter = `blur(${newBlur}px)`;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-900 overflow-auto">
      {/* Futuristic tech sky with distant cities and glowing elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 overflow-hidden">
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

        {/* Grid lines to represent the tech city structure */}
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

      {/* Futuristic header */}
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
                      to={`/${
                        item.toLowerCase() === "home" ? "" : item.toLowerCase()
                      }`}
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

      <main className="relative z-10 pt-8 pb-20 px-4">
        {/* Hero Section */}
        <section className="relative max-w-6xl mx-auto mb-16 flex flex-col items-center justify-center text-center pt-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-lg opacity-30 animate-pulse"></div>
            <img
              src={logo}
              alt="BitVoyager logo"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-cyan-500/50 p-1"
            />
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 tracking-tight">
            BitVoyager
          </h2>
          <h3 className="mt-2 text-xl md:text-2xl text-gray-300 font-medium">
            The top <span className="text-cyan-400 font-bold">1</span> coding
            learning app
          </h3>

          <p className="mt-6 max-w-2xl text-gray-300 text-lg">
            Explore the digital frontier through immersive coding challenges
            that teach you real-world skills. Your adventure in programming
            starts here.
          </p>

          <Link
            to="/courses"
            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-900/30 border border-blue-700/50"
          >
            <span>Launch Your Journey</span>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Tech decorative elements */}
          <div className="absolute top-0 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </section>

        {/* Programming Languages */}
        <section className="max-w-6xl mx-auto mb-24 px-4">
          <div className="text-center mb-12">
            <h4 className="inline-block text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
              Learn Any Language You Want
            </h4>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-300 max-w-xl mx-auto">
              Choose from a variety of languages and start building your tech
              skills today.
            </p>
          </div>

          {/* Scrollable language cards with futuristic design */}
          <div className="flex flex-nowrap items-center space-x-6 overflow-x-auto pb-8 px-4 no-scrollbar min-h-[300px]">
            {languages.map((lang) => {
              const isBash = lang === "Bash";
              const isPython = lang === "Python";
              const isHovered = hoveredLanguage === lang;

              return (
                <div
                  key={lang}
                  className={`
                    relative min-w-[280px] max-w-xs rounded-lg overflow-hidden transition-all duration-300
                    ${
                      isHovered
                        ? "scale-105 shadow-xl shadow-cyan-900/30"
                        : "shadow-lg shadow-gray-900/50"
                    }
                    ${
                      isBash || isPython
                        ? "border border-cyan-500/30"
                        : "border border-gray-700/30"
                    }
                  `}
                  onMouseEnter={() => setHoveredLanguage(lang)}
                  onMouseLeave={() => setHoveredLanguage(null)}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 ${
                      isBash || isPython
                        ? "bg-gradient-to-br from-gray-800/90 via-gray-900 to-blue-900/30"
                        : "bg-gradient-to-br from-gray-800/90 via-gray-900 to-gray-800"
                    }`}
                  ></div>

                  {/* Decorative tech elements */}
                  <div className="absolute inset-0 opacity-20">
                    <svg
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                    >
                      <pattern
                        id={`grid-${lang}`}
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke={isBash || isPython ? "#0ea5e9" : "#6b7280"}
                          strokeWidth="0.5"
                          opacity="0.3"
                        />
                      </pattern>
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill={`url(#grid-${lang})`}
                      />
                    </svg>
                  </div>

                  {/* Glowing effect for Bash */}
                  {(isBash || isPython) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent"></div>
                  )}

                  {/* Content container */}
                  <div className="relative z-10 p-6">
                    <div className="flex items-start space-x-4">
                      {/* Language Icon with glowing effect */}
                      <div
                        className={`relative flex-shrink-0 p-3 rounded-lg ${
                          isBash || isPython
                            ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/50"
                            : "bg-gray-800/50"
                        }`}
                      >
                        <img
                          src={
                            lang === "Bash"
                              ? bash
                              : lang === "Python"
                                ? python
                                : lang === "JavaScript"
                                  ? javascript
                                  : lang === "Java"
                                    ? java
                                    : lang === "C++"
                                      ? cpp
                                      : rust
                          }
                          alt={`${lang} logo`}
                          className="w-10 h-10"
                        />
                        {(isBash || isPython) && (
                          <div className="absolute inset-0 rounded-lg border border-cyan-500/30 shadow-sm shadow-cyan-500/30"></div>
                        )}
                      </div>

                      {/* Language info */}
                      <div className="flex flex-col">
                        <h2
                          className={`text-xl font-bold mb-1 ${
                            isBash || isPython
                              ? "text-cyan-400"
                              : "text-gray-300"
                          }`}
                        >
                          {lang}
                        </h2>
                        <p className="text-sm text-gray-400 line-clamp-3">
                          {description[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div
                      className={`mt-5 flex items-center justify-between ${
                        isBash || isPython ? "" : "opacity-60"
                      }`}
                    >
                      <span
                        className={`text-xs uppercase tracking-wide ${
                          isBash || isPython ? "text-cyan-400" : "text-gray-500"
                        }`}
                      >
                        {isBash || isPython ? "Available Now" : "Coming Soon"}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBash || isPython
                                ? i < 4
                                  ? "bg-cyan-400"
                                  : "bg-gray-700"
                                : "bg-gray-700"
                            }`}
                          ></span>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-5">
                      {isBash ? (
                        <Link
                          to="/bash"
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded border border-cyan-500/30 font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors"
                        >
                          Start Learning
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M5 12h14M12 5l7 7-7 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      ) : isPython ? (
                        <Link
                          to="/python"
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded border border-cyan-500/30 font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors"
                        >
                          Start Learning
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M5 12h14M12 5l7 7-7 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 text-gray-400 rounded border border-gray-700 font-medium cursor-not-allowed"
                        >
                          Coming Soon
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M12 15V3M12 15l-4-4M12 15l4-4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Locked overlay for non-Bash languages */}
                  {!(isBash || isPython) && (
                    <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C9.24 2 7 4.24 7 7v4H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm1 15.06c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM14 10h-4V7c0-1.1.9-2 2-2s2 .9 2 2v3z" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Teachers Section with futuristic design */}
        <section className="max-w-6xl mx-auto mb-24 px-4">
          <div className="text-center mb-12">
            <h4 className="inline-block text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
              Learn from the Best
            </h4>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-300 max-w-xl mx-auto">
              Our courses are taught by elite instructors who will guide you
              through your coding journey.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Noam Favier",
                image: noam,
                role: "Bash & System Architecture",
                focus: "System Automation",
              },
              {
                name: "Mathieu Kircher",
                image: mathieu,
                role: "Algorithm Design",
                focus: "Performance Optimization",
              },
            ].map((teacher) => (
              <div
                key={teacher.name}
                className={`
                  relative w-64 transition-all duration-300 rounded-xl overflow-hidden
                  ${
                    hoveredTeacher === teacher.name
                      ? "scale-105 shadow-xl shadow-purple-900/30"
                      : "shadow-lg shadow-gray-900/50"
                  }
                `}
                onMouseEnter={() => setHoveredTeacher(teacher.name)}
                onMouseLeave={() => setHoveredTeacher(null)}
              >
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-purple-900/30"></div>

                {/* Decorative tech grid */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <pattern
                      id={`grid-teacher-${teacher.name}`}
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill={`url(#grid-teacher-${teacher.name})`}
                    />
                  </svg>
                </div>

                {/* Teacher content */}
                <div className="relative z-10 p-6 flex flex-col items-center">
                  {/* Teacher image with futuristic frame */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-40"></div>
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="relative w-24 h-24 rounded-full border-2 border-purple-500/30 p-1"
                    />

                    {/* Orbital elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="w-full h-full rounded-full border-2 border-dashed border-purple-500/20 animate-spin"
                        style={{ animationDuration: "15s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Teacher info */}
                  <h2 className="text-xl font-bold text-white mb-1">
                    {teacher.name}
                  </h2>
                  <p className="text-sm text-purple-300 mb-3">{teacher.role}</p>

                  {/* Teacher metrics with futuristic style */}
                  <div className="w-full mt-2 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-800/50 rounded p-2 border border-purple-500/20">
                      <p className="text-xs text-gray-400">Specialty</p>
                      <p className="text-sm text-purple-300 font-medium">
                        {teacher.focus}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2 border border-purple-500/20">
                      <p className="text-xs text-gray-400">Rating</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 text-purple-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
