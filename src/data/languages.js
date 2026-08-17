import bash from "../assets/bash.png";
import python from "../assets/python.png";
import javascript from "../assets/javascript.png";
import java from "../assets/java.png";
import cpp from "../assets/c++.png";
import rust from "../assets/rust.png";
import lua from "../assets/lua.svg";

export const languages = [
  {
    name: "Bash",
    image: bash,
    href: "/bash",
    available: true,
    description: "Automate tasks and manage your system right from the command line — like a power user. Real shell, real filesystem, real commands.",
  },
  {
    name: "Python",
    image: python,
    href: "/python",
    available: true,
    description: "A beginner-friendly, high-level language beloved for data science, web apps, and more. Every mission runs on real CPython in your browser.",
  },
  {
    name: "Lua",
    image: lua,
    href: "/lua",
    available: true,
    description: "Small, fast, and embedded everywhere from games to firmware. Every mission runs on a real Lua 5.3 VM, right in your browser.",
  },
  {
    name: "Java",
    image: java,
    available: false,
    description: "A tried-and-true language powering Android apps and countless enterprise solutions worldwide.",
  },
  {
    name: "C++",
    image: cpp,
    available: false,
    description: "The powerhouse behind high-performance software, games, and system-level development.",
  },
  {
    name: "Rust",
    image: rust,
    available: false,
    description: "A modern, memory-safe language built for speed, reliability, and concurrent programming.",
  },
  {
    name: "JavaScript",
    image: javascript,
    available: false,
    description: "The go-to language for creating interactive websites and dynamic web applications.",
  },
];
