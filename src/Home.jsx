import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CityBackdrop from "./components/CityBackdrop";
import SiteHeader from "./components/SiteHeader";
import LanguageCard from "./components/LanguageCard";
import { languages } from "./data/languages";
import logo from "./assets/image.png";
import noam from "./assets/noam.png";
import mathieu from "./assets/mathieu.png";

function Home() {
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [hoveredTeacher, setHoveredTeacher] = useState(null);
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollMetrics, setScrollMetrics] = useState({ scrollLeft: 0, scrollWidth: 1, clientWidth: 1 });
  const [dragging, setDragging] = useState(false);

  const scrollByCards = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * 304, behavior: "smooth" });
  };

  const readMetrics = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setScrollMetrics({ scrollLeft: el.scrollLeft, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
  };

  useEffect(() => {
    readMetrics();
    const el = scrollerRef.current;
    el?.addEventListener("scroll", readMetrics);
    window.addEventListener("resize", readMetrics);
    return () => {
      el?.removeEventListener("scroll", readMetrics);
      window.removeEventListener("resize", readMetrics);
    };
  }, []);

  const maxScroll = Math.max(1, scrollMetrics.scrollWidth - scrollMetrics.clientWidth);
  const thumbWidthPct = Math.min(100, Math.max(12, (scrollMetrics.clientWidth / scrollMetrics.scrollWidth) * 100));
  const thumbLeftPct = (scrollMetrics.scrollLeft / maxScroll) * (100 - thumbWidthPct);

  const scrollToClientX = (clientX) => {
    const track = trackRef.current;
    const el = scrollerRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.scrollLeft = fraction * maxScroll;
  };

  const handleTrackClick = (e) => {
    if (dragging) return;
    scrollToClientX(e.clientX);
  };

  const handleThumbPointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    const onMove = (moveEvent) => scrollToClientX(moveEvent.clientX);
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 overflow-auto scroll-smooth">
      <CityBackdrop />
      <SiteHeader />

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

          <Link to="/courses" className="relative mt-8 inline-flex group">
            <span className="absolute -inset-1 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50 blur-lg cta-pulse"></span>
            <span className="relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-md text-lg font-medium group-hover:from-blue-500 group-hover:to-cyan-500 transition-colors duration-300 shadow-lg shadow-blue-900/30 border border-blue-700/50">
              <span>Launch Your Journey</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
            </span>
          </Link>

          {/* Tech decorative elements */}
          <div className="absolute top-0 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

          <style>
            {`
              @keyframes ctaPulse {
                0%, 100% { opacity: 0.35; transform: scale(0.98); }
                50% { opacity: 0.65; transform: scale(1.04); }
              }
              .cta-pulse { animation: ctaPulse 2.8s ease-in-out infinite; }
            `}
          </style>
        </section>

        {/* Programming Languages */}
        <section id="languages" className="max-w-6xl mx-auto mb-24 px-4 scroll-mt-24">
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
          <div className="relative">
            <button
              onClick={() => scrollByCards(-1)}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-gray-900/90 border border-cyan-500/30 text-cyan-400 hover:bg-gray-800 hover:border-cyan-400/60 transition-colors shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByCards(1)}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-gray-900/90 border border-cyan-500/30 text-cyan-400 hover:bg-gray-800 hover:border-cyan-400/60 transition-colors shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={scrollerRef}
              className="no-scrollbar flex flex-nowrap items-center gap-6 overflow-x-auto pb-6 px-4 min-h-[300px]"
            >
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.name}
                  lang={lang}
                  isHovered={hoveredLanguage === lang.name}
                  onHoverStart={() => setHoveredLanguage(lang.name)}
                  onHoverEnd={() => setHoveredLanguage(null)}
                />
              ))}
            </div>

            {/* Custom slider bar — a real, always-visible scroll affordance */}
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              className="relative mx-4 h-1.5 rounded-full bg-slate-800 cursor-pointer"
            >
              <div
                onPointerDown={handleThumbPointerDown}
                className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 cursor-grab active:cursor-grabbing shadow shadow-cyan-500/40"
                style={{ width: `${thumbWidthPct}%`, left: `${thumbLeftPct}%` }}
              />
            </div>
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
