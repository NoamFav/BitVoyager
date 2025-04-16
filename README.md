# BitVoyager 🚀

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<div align="center">
  <img src="src/assets/image.png" alt="BitVoyager Logo" width="200px">
</div>

> A gamified coding platform to learn programming languages through interactive terminal-based adventures in the browser.

## 🔍 Overview

BitVoyager is a web-based platform that teaches programming languages through interactive stories and hands-on practice. Currently, the platform offers learning paths for Bash and Python, with more languages planned. The application features a storyline-based progression system alongside a sandbox playground for practicing commands in a real terminal environment.

## ✨ Features

- **Interactive Terminal**: Real browser-based terminal emulator using xterm.js
- **Story-driven Learning**: Engaging narrative with 20-level progression system
- **Adaptive Learning**: Task recommendations based on user progress and command history
- **Sandbox Environment**: Practice playground with a fully functional minimalist terminal
- **Multi-language Support**: Currently supports Bash and Python shells

## 🧰 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **Terminal Emulation**: xterm.js, jsh (custom JavaScript shell)
- **State Management**: Context API
- **Routing**: React Router
- **Build Tool**: Vite

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher) or yarn (v1.22.x or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bitvoyager.git
   cd bitvoyager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
bitvoyager/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API and service functions
│   ├── assets/              # Images, SVGs and other assets
│   ├── components/          # Reusable React components
│   │   ├── common/          # Common UI components
│   │   ├── terminal/        # Terminal-related components
│   │   └── ui/              # UI elements
│   ├── context/             # React Context providers
│   ├── data/                # Static data (levels, tasks, etc.)
│   │   ├── bash/            # Bash course data
│   │   └── python/          # Python course data
│   ├── hooks/               # Custom React hooks
│   ├── modules/             # Feature modules
│   │   ├── playground/      # Playground feature 
│   │   └── storyline/       # Storyline feature
│   ├── styles/              # Global styles and Tailwind config
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore file
├── index.html               # HTML template
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🚀 Core Components

### Terminal Implementation

The terminal component uses xterm.js with a custom shell interpreter to provide a realistic terminal experience directly in the browser. The implementation supports:

- Command history navigation
- Tab completion
- Custom shell commands
- Simulated file system operations
- Output handling and display

### Task Recommendation Engine

The recommendation system intelligently suggests tasks based on:

- User's current progress level
- Commands used historically
- Completion status of tasks
- Learning mode preference

When in Learning Mode, the system prioritizes tasks that require commands the user has used least frequently, helping to reinforce learning through balanced practice.

### Level Management

The storyline progression system manages:

- Current level tracking
- Level completion status 
- Navigation between levels
- Task unlocking based on progress
- Language selection and course switching

### Command Validation

The system validates user input in two ways:

- **Exact matching**: Checks for precise command matches
- **Regex validation**: Uses pattern matching for more flexible validation

This allows for both strict command checking in the storyline and more flexible command recognition in the playground environment.

## 🧩 Adding New Content

### Adding a New Level

To add a new level to the Bash course:

1. Create a new level definition in `src/data/bash/levels.ts`
2. Add the level's position to the map in `src/data/bash/map.ts`
3. Define the required commands, objectives, and hints
4. Set up the initial filesystem state and expected outputs

### Adding New Tasks

To add new tasks to the playground:

1. Define the task in `src/data/bash/tasks.ts`
2. Specify required commands and expected outputs
3. Set the minimum level required to unlock the task
4. Add any necessary hints or descriptions

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🔍 Key Features Implementation

- **Adaptive Learning**: Uses a scoring algorithm to calculate command usage frequency and recommend tasks accordingly
- **Terminal Simulation**: Combines xterm.js with a custom shell implementation for an authentic terminal experience
- **Progress Tracking**: Stores user advancement and tailors content based on completion status
- **Command Verification**: Employs flexible validation to accommodate variations in command syntax
- **Interactive Storyline**: Presents challenges in a narrative context to increase engagement

## 🚧 Roadmap

- **User Authentication**: Add login/signup to save progress across sessions
- **More Languages**: Add support for JavaScript, Rust, and Go
- **Multiplayer Mode**: Collaborative coding challenges and competitions
- **Advanced Analytics**: Track user progress with detailed statistics
- **Mobile Support**: Responsive design for mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the BitVoyager Team
</div>
