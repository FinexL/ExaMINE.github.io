import Navi from "./components/Nav";

function Layout() {
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

export default Layout;
