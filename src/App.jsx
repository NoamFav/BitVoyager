import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import "./index.css";

function App() {
  return (
    <Router>
      <div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
