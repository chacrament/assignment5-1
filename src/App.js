import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListPage from "./components/Pages/ListPage";
import DetailPage from "./components/Pages/DetailPage";
import CreatePage from "./components/Pages/CreatePage";
import UpdatePage from "./components/Pages/UpdatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />

        <Route path="/list" element={<ListPage />} />

        <Route path="/create" element={<CreatePage />} />

        <Route path="/detail/:id" element={<DetailPage />} />

        <Route path="/update/:id" element={<UpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
