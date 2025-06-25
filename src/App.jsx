import "./App.css";
import Nav from "./components/Nav";
import Management from "./pages/Management";
import Dashboard from "./pages/Dashboard";
import InputGrades from "./pages/InputGrades";
import ViewGrades from "./pages/ViewGrades";
import { BrowserRouter as Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/input-grades" element={<InputGrades />} />
        <Route path="/view-grades" element={<ViewGrades />} />
        <Route path="/management" element={<Management />} />
      </Routes>
    </>
  );
}

export default App;
