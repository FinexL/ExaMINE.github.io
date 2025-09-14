import "./App.css";
import Nav from "./components/navigations/Nav";
import Management from "./pages/Management";
import Dashboard from "./pages/Dashboard";
import InputGrades from "./pages/InputGrades";
import ViewGrades from "./pages/ViewGrades";
import LogHistory from "./pages/LogHistory";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const location = useLocation();
  const path = location.pathname;
  const showNavOn = [
    "/dashboard",
    "/input-grades",
    "/view-grades",
    "/management",
    "/log-history",
  ];
  const showNav = showNavOn.includes(location.pathname);
  return (
    <>
      {showNav && <Nav />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/input-grades" element={<InputGrades />} />
        <Route path="/view-grades" element={<ViewGrades />} />
        <Route path="/management" element={<Management />} />
        <Route path="/log-history" element={<LogHistory />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
