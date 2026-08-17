import { Link, useLocation } from "react-router-dom";
import logo from "../assets/image.png";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses" },
];

// Shared across Home, Courses and About — was previously duplicated inline
// in Home.jsx only, with nowhere else to link to.
export default function SiteHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-md border-b border-cyan-500/30">
      <div className="w-full max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
              <img src={logo} alt="BitVoyager logo" className="w-8 h-8 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              <span className="font-extrabold">BIT</span>
              <span className="text-xl ml-1 font-light">VOYAGER</span>
            </h1>
          </Link>

          <nav className="flex items-center">
            <ul className="flex gap-8 text-sm font-medium">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-2 py-2 transition-colors duration-300 ${
                        active ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${active ? "bg-cyan-400" : "bg-cyan-500"}`}></span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
