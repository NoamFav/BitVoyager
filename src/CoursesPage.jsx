import { useState } from "react";
import CityBackdrop from "./components/CityBackdrop";
import SiteHeader from "./components/SiteHeader";
import LanguageCard from "./components/LanguageCard";
import { languages } from "./data/languages";

function CoursesPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="relative w-full min-h-screen bg-gray-900 overflow-auto">
      <CityBackdrop />
      <SiteHeader />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-4">
            Courses
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Pick a language and start. Bash and Python are live right now —
            real shell, real Python, real tests, no simulation. The rest are
            on the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {languages.map((lang) => (
            <LanguageCard
              key={lang.name}
              lang={lang}
              isHovered={hovered === lang.name}
              onHoverStart={() => setHovered(lang.name)}
              onHoverEnd={() => setHovered(null)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CoursesPage;
