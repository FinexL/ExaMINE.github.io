import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Management from "./pages/management/Management";
import Dashboard from "./pages/dashboard/Dashboard";
import InputGrades from "./pages/input/InputGrades";
import ViewGrades from "./pages/view/ViewGrades";
import LogHistory from "./pages/LogHistory";

import StudentReport from "./pages/view/StudenReport";
import Archive from "./pages/archive/Archive";
import Login from "./pages/login/Login";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./routes/ProtectedRoutes";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const location = useLocation();
  const path = location.pathname;
  const validPaths = [
    "/dashboard",
    "/input-grades",
    "/view-grades",
    "/management",
    "/log-history",

    "/archive",
  ];

  const showNav = validPaths.includes(location.pathname);

  return (
    <>
      {showNav && <Nav />}

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/input-grades"
          element={
            <ProtectedRoute>
              <InputGrades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-grades"
          element={
            <ProtectedRoute>
              <ViewGrades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <Management />
            </ProtectedRoute>
          }
        />

        <Route
          path="/log-history"
          element={
            <ProtectedRoute>
              <LogHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-grades/:id"
          element={
            <ProtectedRoute>
              <StudentReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
