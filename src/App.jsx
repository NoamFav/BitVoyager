import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Bash from "./Bash";
import BashTask from "./BashTask"; // The new task component
import BashPlayground from "./BashPlayground";
import NotFoundPage from "./NotFoundPage";
import { BashProvider } from "./BashProvider";
import "./index.css";

function App() {
  return (
    <BashProvider>
      <Router>
        <div>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bash" element={<Bash />} />
              <Route path="/bash/:level" element={<BashTask />} />
              <Route path="/bash/playground" element={<BashPlayground />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BashProvider>
  );
}

export default App;
