/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useNavigate } from "react-router-dom";
import { Brain, Rocket } from "lucide-react";
import CityBackdrop from "./components/CityBackdrop";
import python from "./assets/python.png";

export default function PythonModeSelect({ onModeSelect }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-slate-200">
      <CityBackdrop />

      <header className="relative z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
              <img src={python} alt="python" className="w-7 h-7" />
            </div>
            <h1
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="font-extrabold">PYTHON</span>
              <span className="ml-1 font-light">MISSIONS</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-100 mb-2">
          Choose Your Learning Path
        </h2>
        <p className="text-center text-slate-400 mb-12">
          Real Python, running in your browser — every test actually executes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onModeSelect("standard")}
            className="text-left p-6 rounded-lg border border-cyan-800/40 bg-gradient-to-br from-slate-900 to-cyan-950/20 hover:border-cyan-500/60 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              <h3 className="text-lg font-semibold text-slate-100">Standard Mode</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Three missions, one each of easy, medium, and hard difficulty. A
              straightforward, structured run.
            </p>
          </button>

          <button
            onClick={() => onModeSelect("learning")}
            className="text-left p-6 rounded-lg border border-purple-800/40 bg-gradient-to-br from-slate-900 to-purple-950/20 hover:border-purple-500/60 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" />
              <h3 className="text-lg font-semibold text-slate-100">Learning Mode</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Adaptive selection based on your tracked skill levels — missions
              get harder as you improve, and failed or skipped ones resurface.
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}
