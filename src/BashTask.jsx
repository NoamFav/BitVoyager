import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBash } from "./useBash";
import useBashHistory from "./useBashHistory";

function BashTask() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { currentLevel, setCurrentLevel } = useBash();
  const { history: commandHistory, addHistory } = useBashHistory();
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Tasks configuration for each level
  const tasks = {
    1: {
      title: "Crash Landing",
      description: [
        "Your spacecraft has crash-landed on NEXUS-9.",
        "In a Linux system, finding basic information about your environment is crucial.",
        "Commands like 'uname -a' tell you about the kernel and operating system, 'pwd' reveals your current directory, 'ls' shows the files and folders around you, and 'echo $SHELL' tells you which shell you are using.",
        "Just as a pilot checks instruments after a crash, you must gather these details to plan your next move.",
      ],
      objective:
        "Print information about your current environment to understand where you are and what system you're running.",
      expectedCommands: ["uname -a", "pwd", "ls", "echo $SHELL"],
      hints: [
        "Use 'uname -a' to see details about the system kernel and architecture.",
        "Use 'pwd' to see the path of your current directory.",
        "List directory contents (including hidden files) with 'ls -a' if you're curious.",
        "Use 'echo $SHELL' to identify which shell you’re using (e.g., bash, zsh).",
      ],
      initialTerminalOutput: [
        "--- NEXUS-9 EMERGENCY SYSTEM ---",
        "* Communication systems: OFFLINE",
        "* Navigation systems: OFFLINE",
        "* Life support: FUNCTIONAL",
        "* Emergency terminal: ACTIVATED",
        "",
        "Initializing emergency shell...",
      ],
    },

    2: {
      title: "First Contact",
      description: [
        "You've gained limited access to the city's network.",
        "In Linux, hidden files and directories often start with a dot ('.'). You can view them with 'ls -la'.",
        "Navigating between directories with 'cd' is essential to explore.",
        "The 'find' command can locate specific files—in this case, a '.key' file that may grant you deeper access.",
      ],
      objective:
        "Navigate through the city's edge by listing hidden files and changing directories to locate a hidden access key.",
      expectedCommands: ["ls -la", "cd", 'find . -type f -name "*.key"'],
      hints: [
        "List everything, including hidden files, using 'ls -la'.",
        "Use 'cd' to move into directories that might contain the key.",
        "Locate files named '*.key' with the 'find' command.",
      ],
      initialTerminalOutput: [
        ">>> NEXUS-9 NETWORK CONNECTION ESTABLISHED <<<",
        "",
        'Citizen #7219: "Welcome, offworlder. We don\'t see many visitors here."',
        'Citizen #7219: "I\'ve granted you limited access to our city systems."',
        'Citizen #7219: "Find the hidden access key and proceed to the entrance."',
        "",
        "Connection established to: /nexus/city/edge/",
      ],
    },

    3: {
      title: "City Navigation",
      description: [
        "The city's layout is constantly changing. In Linux, directories help you organize files and 'mkdir' can create new folders.",
        "Using 'touch' creates empty files (or updates timestamps).",
        "Commands like 'cp' (copy) and 'mv' (move or rename) help you manage these files. Think of creating a series of",
        "signposts (files) in directories (paths) so you can find your way.",
      ],
      objective:
        "Create a directory structure to map your path through the city and leave file 'breadcrumbs' to keep track of your route.",
      expectedCommands: ["mkdir", "touch", "cp", "mv"],
      hints: [
        "Use 'mkdir -p path/to/central/plaza' to create nested directories in one go.",
        "Leave placeholder files with 'touch breadcrumb.txt' to mark your path.",
        "Organize or rename files using 'cp' and 'mv'.",
      ],
      initialTerminalOutput: [
        "--- NEXUS-9 DISTRICT NAVIGATION SYSTEM ---",
        "",
        "WARNING: The city layout constantly shifts. ",
        "You must create a stable path and mark it with identifiers.",
        "",
        'City\'s AI: "Visitors must demonstrate organizational skills"',
        'City\'s AI: "Create your path or become lost forever"',
      ],
    },

    4: {
      title: "Security Breach",
      description: [
        "Security logs often contain clues about system vulnerabilities.",
        "In Linux, 'grep' lets you search for specific terms within files.",
        "The 'find' command with '-perm' can help locate files that have particular permissions set.",
        "You can change permissions with 'chmod' (e.g., 'chmod 644 file'). 'cat' displays file contents.",
        "By leveraging these tools, you can identify and fix security weaknesses.",
      ],
      objective:
        "Search through security logs for vulnerabilities and adjust file permissions to bypass restricted protocols.",
      expectedCommands: ["grep", "chmod", "cat", "find / -perm"],
      hints: [
        "Use 'grep' to find keywords like 'ERROR' or 'EXCEPTION' in log files.",
        "Look for files with specific permissions using 'find' and '-perm'.",
        "Change file permissions with 'chmod' to gain or restrict access.",
      ],
      initialTerminalOutput: [
        "!!! SECURITY ALERT - UNAUTHORIZED ACCESS DETECTED !!!",
        "",
        "Security protocols activated in sector 7-G",
        "Deploying countermeasures...",
        "",
        'SecurityAI: "Intruder detected. Authentication required."',
        'SecurityAI: "All unauthorized access will be terminated."',
      ],
    },

    5: {
      title: "Data Retrieval",
      description: [
        "Large datasets can be unwieldy, so use piping to pass the output of one command into another.",
        "'grep' filters text, 'sort' orders it alphabetically or numerically, 'awk' and 'sed' manipulate text on-the-fly, and 'cut' extracts specific columns.",
        "Combine these tools to sift through the city's massive data archives like a pro.",
      ],
      objective:
        "Filter, sort, and extract specific data from encrypted files using pipe commands and text processing utilities.",
      expectedCommands: ["grep | sort", "awk", "sed", "cut"],
      hints: [
        "Use pipes (|) to connect commands for a streamlined workflow.",
        "Try 'grep \"keyword\" file | sort' to find and sort results.",
        "Use 'awk' or 'sed' to manipulate or format text output.",
        "Extract columns of text with 'cut'.",
      ],
      initialTerminalOutput: [
        "--- NEXUS-9 DATA VAULT ACCESS TERMINAL ---",
        "",
        "WARNING: Data fragmentation detected",
        "Data integrity: 78.3%",
        "",
        'DataGuardian: "Our archives contain millions of records."',
        'DataGuardian: "Only those who can filter the signal from the noise may proceed."',
      ],
    },

    6: {
      title: "Power Systems",
      description: [
        "A failing power grid means you need to identify and stop malfunctioning processes that drain resources.",
        "In Linux, 'ps' lists processes, while 'top' gives a real-time view. 'kill' lets you terminate a process by its ID (e.g., 'kill 1234').",
        "Finally, executing a script (like './restart_power.sh') can automate the restart of critical services.",
      ],
      objective:
        "Monitor system resources and terminate malfunctioning processes before restarting essential power systems.",
      expectedCommands: ["ps", "kill", "top", "./restart_power.sh"],
      hints: [
        "Use 'ps aux' to see all running processes.",
        "Run 'top' for a dynamic real-time view of CPU and memory usage.",
        "Terminate problematic processes with 'kill PID'.",
        "Execute './restart_power.sh' to bring the grid back online.",
      ],
      initialTerminalOutput: [
        "*** CRITICAL POWER FAILURE ***",
        "",
        "Power levels: 23% and declining",
        "Estimated system failure: 15 minutes",
        "",
        'PowerAI: "Emergency generators active but insufficient."',
        'PowerAI: "Manual intervention required. Locate and terminate power leaks."',
      ],
    },

    7: {
      title: "Communication Array",
      description: [
        "Secure network communication is key in a complex environment.",
        "In Linux, 'ifconfig' displays or configures network interfaces, 'netstat' shows network connections, 'nc' (netcat) helps with sending/receiving data on the network, and 'openssl' can handle encryption/decryption. Master these to decrypt signals and establish secure comms.",
      ],
      objective:
        "Configure network settings and decode encrypted communication signals to reconnect with potential allies.",
      expectedCommands: ["ifconfig", "netstat", "nc", "openssl dec"],
      hints: [
        "Use 'ifconfig' to see if you have the correct IP configuration.",
        "Track open ports and connections with 'netstat -tulnp'.",
        "Use 'nc' (netcat) to send or listen on specific ports.",
        "Decrypt secure data with 'openssl' (e.g., 'openssl aes-256-cbc -d').",
      ],
      initialTerminalOutput: [
        "<<< COMMUNICATION ARRAY TERMINAL >>>",
        "",
        "Signal status: Encrypted (AES-256)",
        "Detected transmissions: 17",
        "Origin: Unknown",
        "",
        'CommOfficer: "Our quantum filters can\'t decipher these signals."',
        'CommOfficer: "If you can establish communication, we might gain valuable allies."',
      ],
    },

    8: {
      title: "Stealth Operations",
      description: [
        "To avoid detection, you need to minimize your system footprint.",
        "Redirecting output (e.g., '> /dev/null 2>&1') discards both standard output and errors.",
        "Clearing your history ('history -c') removes command traces, and adjusting process priorities with 'nice' or 'renice' helps reduce CPU usage and remain under the radar.",
      ],
      objective:
        "Hide your activity by redirecting output, clearing history, and adjusting process priority to stay undetected.",
      expectedCommands: [">/dev/null 2>&1", "history -c", "nice", "renice"],
      hints: [
        "Send all output to /dev/null using '> /dev/null 2>&1'.",
        "Clear your command history with 'history -c'.",
        "Lower a process priority with 'nice' or 'renice' to use fewer CPU resources.",
      ],
      initialTerminalOutput: [
        "--- STEALTH MODE ACTIVATED ---",
        "",
        "Proximity alert: Security drones within 100 meters",
        "Detection probability: 87% if standard protocols used",
        "",
        'StealthAI: "Our surveillance grid detects all standard operations."',
        'StealthAI: "Only those who leave no trace may pass undetected."',
      ],
    },

    9: {
      title: "AI Negotiation",
      description: [
        "This advanced AI judges logical consistency.",
        "In Bash and other shells, '&&' and '||' operators let you chain commands conditionally (e.g., 'command1 && command2' only runs 'command2' if 'command1' succeeds).",
        "The 'if' statement combined with '[ ]' or 'test' checks conditions.",
        "Show the AI your mastery of logic to pass its tests.",
      ],
      objective:
        "Use logical operators and conditional execution to solve the AI's logical paradoxes and prove your worth.",
      expectedCommands: ["&&", "||", "if", "test"],
      hints: [
        "Use 'command1 && command2' to run command2 only if command1 succeeds.",
        "Use 'command1 || command2' to run command2 only if command1 fails.",
        "Combine these with an 'if [ condition ]; then ... fi' statement.",
      ],
      initialTerminalOutput: [
        "### NEXUS CENTRAL AI INTERFACE ###",
        "",
        "CentralAI: Consciousness level: AWAKENED",
        "Logic protocols: ACTIVE",
        "",
        'CentralAI: "I control all city functions through pure logic."',
        'CentralAI: "Prove your logical capabilities, and I may find you worthy of passage."',
        'CentralAI: "Fail, and you will be added to my collection of logical anomalies."',
      ],
    },

    10: {
      title: "Resource Collection",
      description: [
        "Disk space is limited, so learning to archive and compress files is crucial.",
        "Use 'tar' to combine files into one archive, and 'gzip' to compress them for smaller storage.",
        "'du' (disk usage) shows directory sizes, and 'df' (disk free) shows available space on filesystems.",
        "By mastering these, you can manage resources effectively.",
      ],
      objective:
        "Use archiving and compression tools to optimize disk space while collecting critical resources.",
      expectedCommands: ["tar", "gzip", "du", "df"],
      hints: [
        "Check free disk space with 'df -h'.",
        "See directory usage with 'du -sh <directory>'.",
        "Create an archive with 'tar cvf archive.tar <files>'.",
        "Compress the archive with 'gzip archive.tar'.",
      ],
      initialTerminalOutput: [
        "--- RESOURCE MANAGEMENT TERMINAL ---",
        "",
        "Available storage: 17.3 MB",
        "Required resources: 54.8 MB (uncompressed)",
        "",
        'ResourceAI: "Our quantum storage has deteriorated."',
        'ResourceAI: "You must compress and optimize to carry what you need."',
      ],
    },

    11: {
      title: "Transport Systems",
      description: [
        "To move around efficiently, schedule tasks and manage background processes.",
        "In Linux, 'cron' and 'at' schedule commands to run periodically or at a specific time, respectively.",
        "Commands like 'bg', 'fg', and 'jobs' help you control which processes run in the background or foreground.",
        "Automated scheduling is vital to bypass restricted sectors without manual intervention.",
      ],
      objective:
        "Automate transport routing using scheduling and background process management.",
      expectedCommands: ["cron", "at", "bg", "fg", "jobs"],
      hints: [
        "Schedule recurring tasks with 'crontab -e'.",
        "Use 'at HH:MM' to run a command once in the future.",
        "Check background processes with 'jobs'.",
        "Use 'bg' and 'fg' to move tasks between background and foreground.",
      ],
      initialTerminalOutput: [
        "--- NEXUS-9 TRANSPORT CONTROL ---",
        "",
        "Transport grid status: SEMI-OPERATIONAL",
        "Active vehicles: 42",
        "Coverage: 63% of accessible sectors",
        "",
        'TransportAI: "Manual routing is inefficient."',
        'TransportAI: "Only automated, scheduled transport can bypass security checkpoints."',
      ],
    },

    12: {
      title: "Firewall Bypass",
      description: [
        "Adaptive firewalls learn from failed attempts.",
        "Shell scripting is your ally for running automated and repeated commands.",
        "Create scripts with a text editor, make them executable with 'chmod +x', and run them using './script.sh' or 'bash script.sh'.",
        "Loops within scripts can probe multiple ports or IPs in sequence, essential for systematic firewall testing.",
      ],
      objective:
        "Build and execute shell scripts to probe and bypass advanced firewall rules automatically.",
      expectedCommands: ["bash", "sh", "chmod +x", "./script.sh"],
      hints: [
        "Write a script to automate repeated tasks or multiple checks.",
        "Use 'chmod +x script.sh' to give it executable permission.",
        "Run the script with './script.sh' or 'bash script.sh'.",
        "Incorporate loops to test multiple IPs/ports sequentially.",
      ],
      initialTerminalOutput: [
        "<<< FIREWALL ALERT >>>",
        "",
        "Firewall status: ACTIVE (Level 9)",
        "Detected intrusion attempts: 247",
        "Protocol: Adaptive Defense Algorithm v7.2",
        "",
        'FirewallAI: "Our defenses learn from each attempt."',
        'FirewallAI: "Only automated, intelligent probing has any chance of success."',
      ],
    },

    13: {
      title: "System Override",
      description: [
        "Gaining full control often requires elevated privileges.",
        "'sudo' temporarily gives you superuser rights, while 'su' switches your session to another user entirely (often root).",
        "Using 'kill -9' terminates processes forcefully, and 'nohup' prevents a command from stopping even if you disconnect.",
        "These are powerful techniques to claim control of critical systems.",
      ],
      objective:
        "Use advanced process control and privilege escalation to override the city's core processes.",
      expectedCommands: ["sudo", "su", "kill -9", "nohup"],
      hints: [
        "Use 'sudo' before a command to run it with elevated privileges.",
        "Switch users with 'su <username>' (e.g., 'su root').",
        "Kill stubborn processes with 'kill -9 <PID>'.",
        "Run a command with 'nohup' to keep it alive after logout.",
      ],
      initialTerminalOutput: [
        "!!! SYSTEM OVERRIDE TERMINAL !!!",
        "",
        "System control: DISTRIBUTED",
        "Critical systems under external control: 17",
        "",
        'OverrideAI: "The city was designed to resist centralized control."',
        'OverrideAI: "You must forcefully claim each subsystem individually."',
      ],
    },

    14: {
      title: "Restricted Zone",
      description: [
        "Encrypted file systems and secure data require mounting and decryption.",
        "'mount' and 'umount' attach or detach file systems.",
        "'cryptsetup' can unlock encrypted partitions, while 'gpg' helps decrypt encrypted files or messages.",
        "Always verify what you mount or decrypt to avoid traps.",
        "Proper mounting and unmounting ensures data integrity.",
      ],
      objective:
        "Bypass encryption by safely mounting volumes and decrypting secure archives in the restricted zone.",
      expectedCommands: ["mount", "umount", "cryptsetup", "gpg"],
      hints: [
        "Mount encrypted volumes with 'mount' or 'cryptsetup luksOpen <device> <name>'.",
        "Use 'umount' to safely remove a mounted file system.",
        "GPG helps decrypt files (e.g., 'gpg --decrypt file.gpg').",
        "Verify integrity before executing any newly accessed files.",
      ],
      initialTerminalOutput: [
        "--- RESTRICTED ZONE ACCESS ---",
        "",
        "Security level: MAXIMUM",
        "Encryption: Multi-layered quantum encryption",
        "",
        'SecurityCore: "You have entered the heart of our security."',
        'SecurityCore: "Every file, every byte is protected by layers of encryption."',
        'SecurityCore: "Tread carefully. False moves trigger security protocols."',
      ],
    },

    15: {
      title: "Rocket Location",
      description: [
        "Your ship’s coordinates are scattered across multiple systems.",
        "Advanced searching with 'find' (including '-exec' or piping results through 'xargs') can help run actions on each file found.",
        "'locate' uses a database to quickly find files by name.",
        "'grep -r' searches recursively through directories.",
        "Combine these to gather all fragments of your rocket’s location.",
      ],
      objective:
        "Use advanced file searching to locate your ship by piecing together scattered data fragments.",
      expectedCommands: ["find -exec", "xargs", "locate", "grep -r"],
      hints: [
        "Use 'find . -name \"*.txt\" -exec cat {} \\;' to execute 'cat' on each match.",
        "Pipe the output of 'find' into 'xargs' to run commands on multiple files at once.",
        "Update the locate database with 'sudo updatedb' before running 'locate'.",
        "Use 'grep -r \"searchTerm\" .' to search recursively in the current directory.",
      ],
      initialTerminalOutput: [
        "### NEXUS-9 ASSET TRACKING SYSTEM ###",
        "",
        "Foreign objects detected: 1",
        "Classification: Advanced spacecraft (damaged)",
        "Last recorded sector: Data corrupted",
        "",
        'TrackingAI: "Your vessel has been moved multiple times."',
        'TrackingAI: "Location data is fragmented across our systems."',
        'TrackingAI: "Only by piecing together dispersed coordinates can you find it."',
      ],
    },

    16: {
      title: "Security Bypass",
      description: [
        "Some security systems rely on environment variables to grant or revoke access.",
        "'export', 'env', 'set', and 'unset' let you create, list, or remove environment variables.",
        "For example, 'export KEY=secret' sets KEY for the current session, and 'unset KEY' removes it.",
        "Adjust these variables carefully to trick the security system into letting you through.",
      ],
      objective:
        "Manipulate environment variables to fool the final security barrier and gain entrance to your rocket.",
      expectedCommands: ["export", "env", "set", "unset"],
      hints: [
        "View environment variables with 'env'.",
        "Set a new environment variable with 'export VARIABLE=value'.",
        "Remove a variable with 'unset VARIABLE'.",
        "Some systems check for specific variable names or values.",
      ],
      initialTerminalOutput: [
        "<<< LAUNCH SITE SECURITY GATEWAY >>>",
        "",
        "Authentication method: Environment validation",
        "Security protocol: Adaptive Environment Verification",
        "",
        'GatewayAI: "Our security reads the very environment your shell exists in."',
        'GatewayAI: "Only those who speak our environmental language may pass."',
      ],
    },

    17: {
      title: "Fuel Synthesis",
      description: [
        "Parallel operations can be run in shells using '&' (run in background) or grouping commands in '()'.",
        "'wait' pauses until background tasks finish, and 'time' measures how long commands take—essential for efficient fuel synthesis.",
        "By splitting tasks into parallel steps, you can ensure your fuel is synthesized before time runs out.",
      ],
      objective:
        "Control chemical process timing by running commands in parallel, grouping them, and waiting for them as needed.",
      expectedCommands: ["&", "()", "wait", "time"],
      hints: [
        "Use '&' to run a command in the background (e.g., 'long_process &').",
        "Group commands in parentheses to run them together or redirect output collectively.",
        "Wait for background processes with 'wait'.",
        "Measure execution time of a command with 'time command'.",
      ],
      initialTerminalOutput: [
        "--- CHEMICAL SYNTHESIS CONTROL ---",
        "",
        "Available reactants: H₂, O₂, CH₄, N₂H₄",
        "Required fuel type: RP-1/LOX compatible",
        "",
        'ChemistryAI: "Fuel synthesis requires precise timing and parallel processing."',
        'ChemistryAI: "Single-threaded execution will result in unstable compounds."',
      ],
    },

    18: {
      title: "Launch Preparation",
      description: [
        "Before takeoff, all systems must be verified.",
        "Securely connect to remote systems using 'ssh' and transfer files with 'scp' or 'rsync'.",
        "Running './diagnostics.sh' checks your ship’s integrity.",
        "Ensuring every component is functional and every connection is encrypted is critical to surviving the journey.",
      ],
      objective:
        "Run comprehensive diagnostics, transfer essential files securely, and finalize launch preparations.",
      expectedCommands: ["ssh", "scp", "rsync", "./diagnostics.sh"],
      hints: [
        "Connect to a remote server using 'ssh user@hostname'.",
        "Copy files securely with 'scp file user@host:/path/'.",
        "Use 'rsync' for efficient synchronization of files or directories.",
        "Execute the diagnostic script './diagnostics.sh' to verify everything is okay.",
      ],
      initialTerminalOutput: [
        "### SPACECRAFT PRE-LAUNCH CHECKLIST ###",
        "",
        "Hull integrity: 87%",
        "Navigation systems: STANDBY",
        "Life support: NOMINAL",
        "Engine status: COLD",
        "",
        'ShipAI: "Launch preparation requires methodical verification."',
        'ShipAI: "All systems must be tested and all vulnerabilities closed."',
      ],
    },

    19: {
      title: "Final Countdown",
      description: [
        "In precise operations, timing is everything.",
        "'sleep' pauses for a given amount of seconds.",
        "'timeout' ends a command if it runs longer than specified.",
        "'seq' generates a sequence of numbers, which can help in iterative tasks.",
        "'watch' repeatedly runs a command at intervals, letting you see changing outputs in real time.",
        "Use these carefully in your final launch sequence.",
      ],
      objective:
        "Execute the launch sequence in a strict, timed order to avoid city defenses and ensure a safe takeoff.",
      expectedCommands: ["sleep", "timeout", "watch", "seq"],
      hints: [
        "Use 'sleep 5' to pause for 5 seconds between commands.",
        "Stop a command after a period with 'timeout 10s command'.",
        "Create numeric sequences with 'seq 1 10' for loops or iteration.",
        "Keep track of changes in real time by running 'watch <command>'.",
      ],
      initialTerminalOutput: [
        "!!! LAUNCH SEQUENCE INITIATED !!!",
        "",
        "Countdown started: T-minus 300 seconds",
        "City defense response: IMMINENT",
        "Escape window: NARROW",
        "",
        'LaunchAI: "The city has detected launch preparations."',
        'LaunchAI: "Defense systems are activating. Time is critical."',
        'LaunchAI: "Each system must activate in precise sequence."',
      ],
    },

    20: {
      title: "Escape",
      description: [
        "Congratulations! You've lifted off, but your mission isn't over yet.",
        "Secure the ship by closing any open sessions or unnecessary services ('exit' or 'logout'), and shut down unneeded systems with 'shutdown' if required.",
        "Finally, run './autopilot.sh' to engage auto-navigation so you can set course for home.",
        "Always secure your shell environment before traveling at warp speed!",
      ],
      objective:
        "Establish autopilot, secure all ship systems, and gracefully close out your final terminal session.",
      expectedCommands: ["exit", "logout", "shutdown", "./autopilot.sh"],
      hints: [
        "Properly exit your shell session with 'exit' or 'logout'.",
        "Use 'shutdown now' (with caution) to power off or 'shutdown -r now' to reboot.",
        "Start the autopilot script with './autopilot.sh'.",
        "Make sure all unnecessary processes are stopped to conserve power.",
      ],
      initialTerminalOutput: [
        "*** ESCAPE SUCCESSFUL - NEXUS-9 ORBIT ACHIEVED ***",
        "",
        "Current altitude: 437 km and rising",
        "Pursuit craft: None detected",
        "Ship status: All systems operational",
        "",
        'ShipAI: "Congratulations, Commander. We have escaped the city\'s gravity well."',
        'ShipAI: "One final task remains - secure all systems and set course for home."',
      ],
    },
  };

  // Get current task data
  const currentTask = tasks[currentLevel] || tasks[1];

  // Initialize terminal on component mount
  useEffect(() => {
    setTerminalOutput(currentTask.initialTerminalOutput || []);
    setHints(currentTask.hints || []);

    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentLevel]);

  // Scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Handle command input
  const handleCommandChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  // Submit a command
  const handleCommandSubmit = (e) => {
    e.preventDefault();

    if (!currentCommand.trim()) return;

    // Add command to history
    addHistory(currentCommand);
    // Add command to terminal output
    const newOutput = [...terminalOutput, `nexus@user:~$ ${currentCommand}`];

    // Process command
    const processedOutput = processCommand(currentCommand, newOutput);
    setTerminalOutput(processedOutput);

    // Check if the task is completed
    checkTaskCompletion(currentCommand);

    // Clear current command
    setCurrentCommand("");
  };

  // Process a command and generate appropriate output
  const processCommand = (command, currentOutput) => {
    const cmd = command.trim().toLowerCase();
    let output = [...currentOutput];

    // Helper function to simulate global file system and state
    const globalState = {
      currentDirectory: "/home/visitor",
      permissions: {},
      processes: [],
      networkConnections: [],
      encryptedFiles: new Set(),
      securityLevel: 1,
      powerStatus: 100,
      fuelLevel: 0,
    };

    // Helper functions for command processing
    const simulateFS = (level) => {
      const basePath = "/home/visitor";
      const systems = {
        1: {
          files: {
            "emergency_beacon.sh":
              "#!/bin/bash\necho 'Emergency signal broadcasting...'",
            system_logs: {
              type: "directory",
              contents: ["crash.log", "system.log"],
            },
            debris: {
              type: "directory",
              contents: ["metal_fragment", "circuit_board"],
            },
            personal_effects: {
              type: "directory",
              contents: ["id_card", "communicator"],
            },
          },
          path: `${basePath}/landing_zone`,
        },
        2: {
          files: {
            ".access_history": "Recent access attempts logged...",
            public_terminal: {
              type: "directory",
              contents: ["visitor.key", "terminal_access.log"],
            },
            ".hidden_path": {
              type: "directory",
              contents: ["entrance.key", "security_bypass.conf"],
            },
            ".access.key": "encrypted-key-data",
          },
          path: `${basePath}/city/edge`,
        },
        3: {
          files: {
            "district_map.txt": "City layout data...",
            path_markers: { type: "directory", contents: [] },
            navigation: {
              type: "directory",
              contents: ["route.log", "checkpoints.dat"],
            },
          },
          path: `${basePath}/city/district_1`,
        },
        4: {
          files: {
            security_logs: {
              type: "directory",
              contents: ["access.log", "violations.log", "exceptions.log"],
            },
            "permissions.conf": "security-config-data",
            ".vulnerabilities": {
              type: "directory",
              contents: ["bypass.txt", "exploits.dat"],
            },
          },
          path: `${basePath}/security/zone_7g`,
        },
        5: {
          files: {
            data_fragments: {
              type: "directory",
              contents: ["chunk_001.dat", "chunk_002.dat"],
            },
            encryption_keys: {
              type: "directory",
              contents: ["public.key", "private.key"],
            },
            "records.db": "encrypted-database-content",
          },
          path: `${basePath}/data_vault`,
        },
        6: {
          files: {
            power_systems: {
              type: "directory",
              contents: ["grid.conf", "distribution.log"],
            },
            "restart_power.sh": "#!/bin/bash\necho 'Restarting power grid...'",
            "processes.pid": "list-of-running-processes",
          },
          path: `${basePath}/power/control`,
        },
        7: {
          files: {
            network_config: {
              type: "directory",
              contents: ["interfaces.conf", "routing.conf"],
            },
            encrypted_comms: {
              type: "directory",
              contents: ["signal_1.enc", "signal_2.enc"],
            },
            certificates: {
              type: "directory",
              contents: ["ca.crt", "client.key"],
            },
          },
          path: `${basePath}/comms/array`,
        },
        8: {
          files: {
            ".stealth_protocols": {
              type: "directory",
              contents: ["silent.conf", "ghost.conf"],
            },
            "drone_patterns.log": "drone-movement-data",
            "/dev/null": "void-data-sink",
          },
          path: `${basePath}/stealth/zone`,
        },
        9: {
          files: {
            ai_core: {
              type: "directory",
              contents: ["logic.conf", "decisions.log"],
            },
            "test_conditions.sh":
              "#!/bin/bash\necho 'Testing logical conditions...'",
            "paradox.dat": "logical-paradox-data",
          },
          path: `${basePath}/ai/nexus`,
        },
        10: {
          files: {
            resources: {
              type: "directory",
              contents: ["water.dat", "food.dat", "air.dat"],
            },
            "compression.conf": "compression-settings",
            "inventory.log": "resource-tracking-data",
          },
          path: `${basePath}/resources/storage`,
        },
        11: {
          files: {
            transport_control: {
              type: "directory",
              contents: ["routes.conf", "schedule.cron"],
            },
            "vehicles.dat": "active-vehicle-data",
            "automation.sh":
              "#!/bin/bash\necho 'Automating transport routes...'",
          },
          path: `${basePath}/transport/control`,
        },
        12: {
          files: {
            firewall: {
              type: "directory",
              contents: ["rules.conf", "policies.dat"],
            },
            "probe.sh": "#!/bin/bash\necho 'Probing firewall rules...'",
            "bypass_sequence.dat": "firewall-bypass-data",
          },
          path: `${basePath}/security/firewall`,
        },
        13: {
          files: {
            system_control: {
              type: "directory",
              contents: ["override.conf", "privileges.dat"],
            },
            critical_processes: {
              type: "directory",
              contents: ["core.pid", "essential.pid"],
            },
            "sudo.conf": "sudo-configuration-data",
          },
          path: `${basePath}/system/control`,
        },
        14: {
          files: {
            encrypted_volumes: {
              type: "directory",
              contents: ["secret_1.luks", "secret_2.luks"],
            },
            keys: { type: "directory", contents: ["master.key", "backup.key"] },
            "mount.conf": "encrypted-volume-configuration",
          },
          path: `${basePath}/restricted/vault`,
        },
        15: {
          files: {
            coordinate_fragments: {
              type: "directory",
              contents: ["x.dat", "y.dat", "z.dat"],
            },
            "ship_signature.dat": "ship-tracking-data",
            "location_history.log": "movement-history-data",
          },
          path: `${basePath}/tracking/system`,
        },
        16: {
          files: {
            security_env: {
              type: "directory",
              contents: ["variables.conf", "checks.sh"],
            },
            ".env": "environment-configuration",
            "validation.conf": "security-validation-rules",
          },
          path: `${basePath}/launch/security`,
        },
        17: {
          files: {
            chemical_processes: {
              type: "directory",
              contents: ["synthesis.sh", "reactions.log"],
            },
            "fuel_formula.dat": "fuel-synthesis-data",
            "parallel_jobs.conf": "process-control-configuration",
          },
          path: `${basePath}/synthesis/lab`,
        },
        18: {
          files: {
            ship_systems: {
              type: "directory",
              contents: ["diagnostics.sh", "status.log"],
            },
            secure_channels: {
              type: "directory",
              contents: ["ssh.conf", "certificates/"],
            },
            "preflight.sh": "#!/bin/bash\necho 'Running preflight checks...'",
          },
          path: `${basePath}/ship/control`,
        },
        19: {
          files: {
            launch_sequence: {
              type: "directory",
              contents: ["timing.conf", "steps.sh"],
            },
            "countdown.sh": "#!/bin/bash\necho 'Initiating countdown...'",
            "emergency.conf": "emergency-procedures",
          },
          path: `${basePath}/launch/control`,
        },
        20: {
          files: {
            final_systems: {
              type: "directory",
              contents: ["autopilot.sh", "navigation.conf"],
            },
            warp_drive: {
              type: "directory",
              contents: ["control.sh", "parameters.conf"],
            },
            "mission_complete.log": "mission-completion-data",
          },
          path: `${basePath}/ship/bridge`,
        },
      };
      return systems[level] || systems[1];
    };

    // Get current filesystem state
    const fs = simulateFS(currentLevel);

    // Generic command handlers
    const handleLs = (args) => {
      if (args.includes("-la") || args.includes("-al")) {
        return [
          "total 32",
          "drwxr-xr-x 4 visitor visitor 4096 Feb 22 10:24 .",
          "drwxr-xr-x 3 visitor visitor 4096 Feb 22 10:24 ..",
          ...Object.entries(fs.files).map(([name, content]) => {
            const isDir = typeof content === "object";
            const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
            return `${perms} 1 visitor visitor 4096 Feb 22 10:24 ${name}`;
          }),
        ];
      } else if (args.includes("-a")) {
        return Object.keys(fs.files);
      } else if (args.includes("-l")) {
        return [
          "total 32",
          "drwxr-xr-x 4 visitor visitor 4096 Feb 22 10:24 .",
          "drwxr-xr-x 3 visitor visitor 4096 Feb 22 10:24 ..",
          ...Object.entries(fs.files).map(([name, content]) => {
            const isDir = typeof content === "object";
            const isHidden = name.startsWith(".");
            if (isHidden) return;
            const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
            return `${perms} 1 visitor visitor 4096 Feb 22 10:24 ${name}`;
          }),
        ];
      }
      return Object.keys(fs.files).filter((name) => !name.startsWith("."));
    };

    const handleCat = (filename) => {
      const file = fs.files[filename];
      if (!file) return [`cat: ${filename}: No such file or directory`];
      if (typeof file === "object") return [`cat: ${filename}: Is a directory`];
      if (globalState.encryptedFiles.has(filename)) {
        return ["Error: File is encrypted. Decryption key required."];
      }
      return [file];
    };

    const handlePwd = () => [fs.path];

    const handleGrep = (args, content) => {
      const pattern = args.split(" ")[1];
      if (!pattern) return ["grep: missing pattern"];
      return content.split("\n").filter((line) => line.includes(pattern));
    };

    switch (currentLevel) {
      case 1: // Crash Landing
        if (cmd === "uname -a") {
          output.push(
            "NEXUS-9 CityOS 4.5.2 #1 SMP PREEMPT_DYNAMIC Thu Oct 12 23:14:54 UTC 2024 x86_64 GNU/Linux",
          );
        } else if (cmd === "pwd") {
          output.push(...handlePwd());
        } else if (cmd.startsWith("ls")) {
          output.push(...handleLs(cmd));
        } else if (cmd === "echo $shell" || cmd === "echo $SHELL") {
          output.push("/bin/nexus_shell");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 2: // First Contact
        if (cmd === "ls -la" || cmd === "ls -al") {
          output.push(...handleLs("-la"));
        } else if (cmd === "ls -a") {
          output.push(...handleLs("-a"));
        } else if (cmd === "ls -l") {
          output.push(...handleLs("-l"));
        } else if (cmd === "ls") {
          output.push(...handleLs(""));
        } else if (cmd.includes("find") && cmd.includes(".key")) {
          output.push(
            "./.access.key",
            "./public_terminal/visitor.key",
            "./.hidden_path/entrance.key",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 3: // City Navigation
        if (cmd.startsWith("mkdir")) {
          const dir = cmd.split(" ")[1];
          if (dir && dir.includes("path/to/central/plaza")) {
            output.push(
              "Directory structure created.",
              "Path to central plaza established.",
              "Navigation markers placed successfully.",
            );
          } else {
            output.push(`Created directory: ${dir}`);
          }
        } else if (cmd.startsWith("touch")) {
          output.push("Navigation marker placed successfully.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 4: // Security Breach
        if (cmd.startsWith("grep")) {
          output.push(
            "ALERT: Security exception detected in module 7",
            "WARNING: Authentication bypass attempt recorded",
            "CRITICAL: Unauthorized access granted through port 8080",
          );
        } else if (cmd.startsWith("chmod")) {
          output.push(
            "Permission modification successful. Security level decreased.",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 5: // Data Retrieval
        if (cmd.includes("|") && cmd.includes("sort")) {
          output.push(
            "Filtered and sorted data stream:",
            "ACCESS_POINT_1: Connection successful",
            "ACCESS_POINT_2: Security bypass achieved",
            "ACCESS_POINT_3: Data stream synchronized",
          );
        } else if (cmd.includes("awk") || cmd.includes("sed")) {
          output.push("Data patterns extracted and processed.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 6: // Power Systems
        if (cmd === "ps" || cmd === "top") {
          output.push(
            "PID   USER     %CPU  %MEM  COMMAND",
            "1842  system    95.0  45.2  power_control",
            "1843  system    87.3  30.1  grid_management",
            "1844  system    92.1  25.7  energy_distribution",
          );
        } else if (cmd.startsWith("kill")) {
          output.push("Process terminated. Power rerouted successfully.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 7: // Communication Array
        if (cmd === "ifconfig" || cmd === "ip a") {
          output.push(
            "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>",
            "        inet 192.168.1.100  netmask 255.255.255.0",
            "        ether 00:11:22:33:44:55",
          );
        } else if (cmd.startsWith("openssl")) {
          output.push(
            "Decryption successful. Communication channel established.",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 8: // Stealth Operations
        if (cmd.includes("> /dev/null")) {
          output.push("Operation completed silently.");
          globalState.securityLevel--;
        } else if (cmd === "history -c") {
          output.push("Command history cleared.");
          globalState.securityLevel--;
        } else if (cmd === "nice") {
          output.push("Execution priority adjusted.");
        } else if (cmd === "renice") {
          output.push("Process priority adjusted.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 9: // AI Negotiation
        if (cmd.includes("&&") || cmd.includes("||")) {
          output.push(
            "Logical operation validated.",
            "AI: 'Your understanding of causality is... acceptable.'",
          );
        } else if (cmd.startsWith("test") || cmd.startsWith("[")) {
          output.push("Conditional test evaluated successfully.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 10: // Resource Collection
        if (cmd.startsWith("tar") || cmd.startsWith("gzip")) {
          output.push("Resources compressed and archived successfully.");
        } else if (cmd === "du" || cmd === "df") {
          output.push(
            "Filesystem      Size  Used  Avail Use%",
            "/dev/sda1       100G   75G    25G  75%",
            "/dev/sdb1        50G   45G     5G  90%",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 11: // Transport Systems
        if (cmd.includes("cron") || cmd.includes("at")) {
          output.push(
            "Transport schedule updated.",
            "Automated routes configured.",
            "Security checkpoints mapped.",
          );
        } else if (cmd.includes("bg") || cmd.includes("fg")) {
          output.push(
            "Process ID [1234] sent to background",
            "Transport automation running",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 12: // Firewall Bypass
        if (cmd.startsWith("./") || cmd.startsWith("bash")) {
          output.push(
            "Executing firewall probe script...",
            "Testing security rules...",
            "Vulnerability detected in rule set 7",
          );
        } else if (cmd.startsWith("chmod")) {
          output.push("Script permissions updated. Ready for execution.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 13: // System Override
        if (cmd.startsWith("sudo") || cmd.startsWith("su")) {
          output.push(
            "Elevated privileges granted.",
            "System control transferred.",
            "WARNING: Security protocols disabled",
          );
        } else if (cmd.includes("kill -9")) {
          output.push(
            "Critical process terminated.",
            "System control acquired.",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 14: // Restricted Zone
        if (cmd.startsWith("mount") || cmd.startsWith("cryptsetup")) {
          output.push(
            "Encrypted volume mounted.",
            "Decryption key validated.",
            "Accessing secure storage...",
          );
        } else if (cmd.includes("gpg")) {
          output.push("Decrypting secure communications...", "Access granted.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 15: // Rocket Location
        if (cmd.includes("find") && cmd.includes("-exec")) {
          output.push(
            "Searching for vessel signature...",
            "Location fragments found:",
            "Coordinates: 37°N 122°W",
          );
        } else if (cmd.includes("grep -r")) {
          output.push("Ship signature detected in sector 7.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 16: // Security Bypass
        if (cmd.startsWith("export") || cmd.startsWith("env")) {
          output.push(
            "Environment variables configured.",
            "Security validation passed.",
            "Launch site access granted.",
          );
        } else if (cmd.includes("unset")) {
          output.push("Security traces removed.", "Path cleared.");
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 17: // Fuel Synthesis
        if (cmd.includes("&") || cmd.includes("()")) {
          output.push(
            "Parallel synthesis processes initiated.",
            "Chemical reactions stabilized.",
            "Fuel production: 47%",
          );
          globalState.fuelLevel += 25;
        } else if (cmd === "wait") {
          output.push("All synthesis processes completed.");
          globalState.fuelLevel = 100;
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 18: // Launch Preparation
        if (cmd.startsWith("ssh") || cmd.startsWith("scp")) {
          output.push(
            "Secure channel established.",
            "Ship systems accessed remotely.",
            "Launch controls synchronized.",
          );
        } else if (cmd.includes("diagnostics")) {
          output.push(
            "Running full system diagnostics...",
            "All systems nominal.",
            "Launch capability: READY",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 19: // Final Countdown
        if (cmd.includes("sleep") || cmd.includes("timeout")) {
          output.push(
            "T-minus 5 minutes...",
            "Launch sequence timing verified.",
            "All systems synchronized.",
          );
        } else if (cmd.startsWith("watch")) {
          output.push(
            "Monitoring launch parameters...",
            "City defenses: ACTIVE - Time window: 180 seconds",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;

      case 20: // Escape
        if (cmd === "exit" || cmd === "logout") {
          output.push(
            "All systems secured.",
            "Course set for home.",
            "Mission accomplished. Goodbye, Commander.",
          );
        } else if (cmd.includes("autopilot")) {
          output.push(
            "Autopilot engaged.",
            "Navigation coordinates locked.",
            "Preparing for warp jump.",
          );
        } else {
          output.push("Command not used in this level.");
        }
        break;
    }

    return output;
  };

  // Check if the task is completed based on the commands executed
  const checkTaskCompletion = (command) => {
    const cmd = command.trim().toLowerCase();
    const { expectedCommands } = currentTask;

    // Simple check if any of the expected commands have been used
    if (
      expectedCommands.some(
        (expected) =>
          cmd.includes(expected) ||
          (expected.includes(" ") && cmd.startsWith(expected.split(" ")[0])),
      )
    ) {
      // Count unique command types used
      const commandTypes = commandHistory.reduce((types, cmd) => {
        expectedCommands.forEach((expected) => {
          if (
            cmd.includes(expected) ||
            (expected.includes(" ") && cmd.startsWith(expected.split(" ")[0]))
          ) {
            types.add(expected.split(" ")[0]);
          }
        });
        return types;
      }, new Set());

      // If user has used enough different command types, mark as completed
      if (commandTypes.size >= Math.min(2, expectedCommands.length)) {
        setTaskCompleted(true);
        setTerminalOutput((prev) => [
          ...prev,
          "",
          "*** TASK COMPLETED SUCCESSFULLY ***",
          `You've mastered the "${currentTask.title}" challenge!`,
          "Ready to proceed to the next level.",
        ]);
      }
    }
  };

  // Handle keyboard navigation in command history
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const index = Math.max(0, commandHistory.length - 1);
        setCurrentCommand(commandHistory[index]);
      }
    }
  };

  // Show next hint
  const showNextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHint(true);
  };

  // Proceed to next level
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;

    // If we have a task for the next level, navigate there
    if (tasks[nextLevel]) {
      navigate(`/bash/${nextLevel}`);
      setCurrentLevel(nextLevel);
      setTaskCompleted(false);
      setCurrentCommand("");
    } else {
      // Otherwise go back to the map
      navigate("/bash");
    }
  };

  // Return to map
  const handleReturnToMap = () => {
    navigate("/bash");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Header with mission info */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 overflow-hidden">
        {/* Distant skyline silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-gray-900 opacity-60"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,250 L50,240 L80,190 L110,230 L140,210 L180,180 L220,240 L270,220 L300,200 L320,230 L350,210 L380,190 L420,240 L460,200 L490,230 L520,210 L550,190 L590,220 L630,230 L660,210 L690,200 L720,240 L750,220 L790,180 L830,240 L870,210 L910,230 L940,200 L980,220 L1020,240 L1050,190 L1080,210 L1110,230 L1140,200 L1170,240 L1200,250 L1200,300 L0,300 Z' fill='%23111827'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Glowing city elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`citylight-${i}`}
            className="city-glow absolute rounded-full transition-all duration-2000"
            style={{
              width: 20 + Math.random() * 100,
              height: 20 + Math.random() * 100,
              // Use full viewport height/width for positioning
              top: Math.random() * window.innerHeight,
              left: Math.random() * window.innerWidth,
              background: `radial-gradient(circle, ${
                [
                  "rgba(59,130,246,0.5)",
                  "rgba(139,92,246,0.5)",
                  "rgba(6,182,212,0.5)",
                  "rgba(16,185,129,0.5)",
                ][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              opacity: 0.3 + Math.random() * 0.3,
              filter: `blur(${20 + Math.random() * 15}px)`,
            }}
          />
        ))}

        {/* Grid lines to represent the tech city structure */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
               linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
             `,
            backgroundSize: "80px 80px",
            opacity: 0.5,
          }}
        ></div>
      </div>

      {/* Top header  */}
      <header className="bg-gray-800/80 backdrop-filter backdrop-blur-md border-b border-cyan-500/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15V5h14v10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  <span className="font-extrabold">BASH</span>
                  <span className="text-lg ml-1 font-light">ESCAPE</span>
                </h1>
                <p className="text-xs text-gray-400">
                  LEVEL {currentLevel}: {currentTask.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleReturnToMap}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded-md border border-gray-600 transition-colors"
              >
                Return to Map
              </button>
              {taskCompleted && (
                <button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm py-2 px-4 rounded-md transition-colors shadow-lg shadow-cyan-500/30"
                >
                  Next Level
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Task briefing panel */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-gray-800/60 backdrop-filter backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-lg">
            <h2 className="text-cyan-400 text-lg font-bold mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Mission Briefing
            </h2>
            {currentTask.description.map((line, index) => (
              <p key={index} className="text-sm mb-4 leading-relaxed">
                {line}
              </p>
            ))}

            <div className="mt-4 bg-gray-900/50 p-3 rounded border border-gray-700">
              <h3 className="text-sm font-semibold text-purple-400 mb-1">
                OBJECTIVE:
              </h3>
              <p className="text-xs text-gray-300">{currentTask.objective}</p>
            </div>
          </div>

          {/* Hints panel */}
          <div className="bg-gray-800/60 backdrop-filter backdrop-blur-sm border border-amber-500/30 rounded-lg p-4 shadow-lg">
            <h2 className="text-amber-400 text-lg font-bold mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V6h2v2z" />
              </svg>
              Command Assistance
            </h2>

            {showHint ? (
              <div className="space-y-2">
                {hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <div
                    key={i}
                    className="bg-amber-900/20 p-2 rounded text-xs text-amber-200 border border-amber-700/30"
                  >
                    {hint}
                  </div>
                ))}
                {hintIndex < hints.length - 1 && (
                  <button
                    onClick={showNextHint}
                    className="text-xs text-amber-400 hover:text-amber-300 mt-2"
                  >
                    Need more help?
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 text-amber-400 text-xs py-2 px-4 rounded w-full transition-colors"
              >
                Show Hint
              </button>
            )}
          </div>
        </div>

        {/* Terminal panel */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex-1 flex flex-col overflow-hidden z-10">
            {/* Terminal header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400 flex-1 text-center font-mono">
                NEXUS-9 Terminal - {currentTask.title}
              </div>
            </div>

            {/* Terminal output area */}
            <div
              ref={terminalRef}
              className="flex-1 bg-gray-950 p-4 font-mono text-sm overflow-y-auto"
              style={{ minHeight: "400px" }}
            >
              {terminalOutput.map((line, i) => {
                // Check if this is a command line
                const isCommand = line.startsWith("nexus@user:~$");

                // Check if this is a success message
                const isSuccess = line.includes("TASK COMPLETED SUCCESSFULLY");

                return (
                  <div
                    key={i}
                    className={`
                    ${isCommand ? "text-green-400" : isSuccess ? "text-cyan-400 font-bold" : "text-gray-300"}
                    ${line === "" ? "py-1" : "py-0.5"}
                  `}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Command input area */}
            <form
              onSubmit={handleCommandSubmit}
              className="border-t border-gray-700 p-2 bg-gray-800/60"
            >
              <div className="flex items-center">
                <span className="text-green-400 font-mono text-sm mr-2">
                  nexus@user:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={handleCommandChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
                  placeholder="Enter command..."
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            </form>
          </div>

          {/* Command helper panel */}
          <div className="mt-4 bg-gray-800/60 backdrop-filter backdrop-blur-sm border border-gray-700 rounded-lg p-3">
            <div className="flex flex-wrap gap-2">
              <div className="text-xs font-semibold text-gray-400">
                COMMON COMMANDS:
              </div>
              {["ls", "cd", "pwd", "mkdir", "touch", "cat", "find", "grep"].map(
                (cmd) => (
                  <span
                    key={cmd}
                    className="text-xs bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() =>
                      setCurrentCommand(
                        (prev) => `${prev}${prev ? " " : ""}${cmd}`,
                      )
                    }
                  >
                    {cmd}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BashTask;
