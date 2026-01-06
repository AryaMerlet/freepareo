import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MarkdownEditor from "./components/MarkdownEditor";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Création de ressources</h1>
        <MarkdownEditor />
      </div>
    </>
  );
}

export default App;
