import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.jsx";
import MarkdownEditor from "./components/MarkdownEditor.jsx";

function App() {
  return (
    <Routes>
      {/* <Route element={<AuthLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<AuthCheck />}> */}
      <Route path="/" element={<MainLayout />} />
      <Route path="/ressource-documentation" element={<MarkdownEditor />} />
      {/* </Route> */}
    </Routes>
  );
}

export default App;
