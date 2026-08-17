import { Link } from "react-router-dom";
import { Rocket, Terminal, Code2, ShieldCheck } from "lucide-react";
import CityBackdrop from "./components/CityBackdrop";
import SiteHeader from "./components/SiteHeader";

const PRINCIPLES = [
  {
    icon: Terminal,
    title: "A real shell, not a script pretending to be one",
    body: "Every Bash mission runs on a real interpreter we built for this app: a real tokenizer, a real virtual filesystem with real permission bits, real pipes and redirects. Commands actually execute against real state — nothing is a canned response to a string match.",
  },
  {
    icon: Code2,
    title: "Real Python, not a simulation of it",
    body: "The Python missions run on Pyodide — actual CPython compiled to WebAssembly, executing in your browser. When your test passes, it's because your code actually ran and produced the right answer.",
  },
  {
    icon: ShieldCheck,
    title: "Progress means you actually did it",
    body: "A mission is marked complete by inspecting real end-state — a file that exists with the right content, a process that's actually gone, an environment variable that's actually set — not by guessing from which words you typed.",
  },
];

function AboutPage() {
  return (
    <div className="relative w-full min-h-screen bg-gray-900 overflow-auto">
      <CityBackdrop />
      <SiteHeader />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-4">
            About BitVoyager
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            BitVoyager teaches real command-line and programming skills through
            missions set on NEXUS-9 — a fictional planet, running on a very
            real execution engine underneath.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-16">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-4 rounded-lg border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm p-6"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow shadow-cyan-500/30">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-cyan-300 mb-1.5">{title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Curious who&apos;s behind it?{" "}
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 underline">
              Meet the team on the home page
            </Link>
            .
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-md font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors shadow-lg shadow-blue-900/30 border border-blue-700/50"
          >
            <Rocket className="w-4 h-4" />
            See the courses
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AboutPage;
