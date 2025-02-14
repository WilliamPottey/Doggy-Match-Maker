import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dogs from "./Pages/Dogs";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dogs" element={<Dogs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
