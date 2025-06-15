import { useState } from "react";
import "./App.css";
import Navi from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import InputGrades from "./pages/InputGrades";
import ViewGrades from "./pages/ViewGrades";
import Management from "./pages/Management";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navi />
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
