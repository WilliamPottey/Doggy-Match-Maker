import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dogs from "./Pages/Dogs";

function App() {
  return (
    <>
      <HashRouter hashType="noslash">
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dogs" element={<Dogs />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
