import TerminalComponent from "./terminal";
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <div>
            <h1>Learn Bash - Web Terminal</h1>
            <TerminalComponent />
        </div>
    );
}

export default App;
