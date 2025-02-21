import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Bash from "./Bash";
import "./index.css";

function App() {
  return (
    <Router>
      <div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bash" element={<Bash />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
