import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Terminal from "./terminal";

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
  const languages = ["Bash", "Python", "JavaScript", "Java", "C++", "Rust"];
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

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center">
      {/* Hero Section */}
      <header className="relative w-full flex flex-col items-center justify-center text-center py-12 md:py-16">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="BitJourney logo"
            className="w-32 h-32 md:w-40 md:h-40 mb-4 drop-shadow-lg rounded-full"
          />
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
            BitJourney
          </h2>
          <h3 className="text-xl md:text-2xl text-gray-600 font-medium">
            The top <span className="text-blue-500">1</span> coding learning app
          </h3>
        </div>

        {/* Floating decorative elements (optional) */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse" />
      </header>

      {/* Navigation */}
      <nav className="mb-8">
        <ul className="flex gap-8 text-lg font-medium">
          {["Home", "About", "Courses"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Call to Action */}
      <section className="w-full max-w-3xl px-4 mb-12 text-center">
        <div className="bg-white shadow-lg rounded-xl p-8 md:p-12">
          <h4 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Start your journey today
          </h4>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Learn to code and become a master in programming. Start your journey
            today with{" "}
            <span className="font-bold text-blue-500">BitJourney</span>.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-blue-500 text-white px-8 py-3 mt-6 rounded-full text-lg font-semibold hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
          >
            Start now
          </Link>
        </div>
      </section>

      {/* Programming Languages */}
      <section className="w-full max-w-5xl px-4 mb-12">
        <h4 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
          Learn any language you want
        </h4>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
          Choose from a variety of languages and start learning today.
        </p>

        {/* Scrollable row */}
        <ul className="flex flex-nowrap items-center space-x-6 overflow-x-auto p-4 min-h-[250px] no-scrollbar">
          {languages.map((lang) => {
            const isBash = lang === "Bash";
            return (
              <motion.li
                key={lang}
                whileHover={{ scale: 1.05 }}
                className={
                  `group relative min-w-[240px] max-w-xs rounded-lg p-4 flex items-center space-x-4 transition-transform shadow-md ` +
                  (isBash
                    ? `bg-white` // Bash is fully available
                    : `bg-gray-100 cursor-not-allowed`) // others are "not available"
                }
              >
                {/* Language Icon */}
                <img
                  src={
                    isBash
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
                  className="w-12 h-12 flex-shrink-0"
                />

                {/* Name & Description */}
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium text-gray-800">{lang}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {description[lang]}
                  </p>
                </div>

                {/* Tooltip - shows on hover if NOT Bash */}
                {!isBash && (
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Not available yet
                  </span>
                )}
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* Teachers Section */}
      <section className="w-full max-w-5xl px-4 mb-16">
        <h4 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
          Learn from the best
        </h4>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
          Our courses are taught by the best instructors who will guide you
          through your journey.
        </p>

        <ul className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Noam Favier", image: noam },
            { name: "Mathieu Kircher", image: mathieu },
          ].map((teacher) => (
            <motion.li
              key={teacher.name}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <li
                key={teacher.name}
                className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <h2 className="text-lg font-medium text-gray-800">
                  {teacher.name}
                </h2>
                {/* Additional info or social links could go here */}
              </li>
            </motion.li>
          ))}
        </ul>
      </section>
      <Terminal />
      {/* Footer */}
      <footer className="w-full py-6 text-center bg-white shadow-inner">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} BitJourney. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

export default Home;
