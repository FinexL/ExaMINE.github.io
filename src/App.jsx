import { useState } from "react";
import "./App.css";
import Navi from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navi />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
