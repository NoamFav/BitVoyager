import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import CoursesPage from "./CoursesPage";
import AboutPage from "./AboutPage";
import Bash from "./Bash";
import PythonMap from "./PythonMap";
import PythonLesson from "./PythonLesson";
import LuaMap from "./LuaMap";
import LuaLesson from "./LuaLesson";
import BashLesson from "./BashLesson";
import BashPlayground from "./BashPlayground";
import NotFoundPage from "./NotFoundPage";
import { BashProvider } from "./BashProvider";
import { BashHistoryProvider } from "./BashHistoryProvider";
import "./index.css";

function App() {
  return (
    <BashProvider>
      <BashHistoryProvider>
        <Router>
          <div>
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/bash" element={<Bash />} />
                <Route path="/bash/playground" element={<BashPlayground />} />
                <Route path="/bash/:level" element={<BashLesson />} />
                <Route path="/python" element={<PythonMap />} />
                <Route path="/python/:level" element={<PythonLesson />} />
                <Route path="/lua" element={<LuaMap />} />
                <Route path="/lua/:level" element={<LuaLesson />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </BashHistoryProvider>
    </BashProvider>
  );
}

export default App;
