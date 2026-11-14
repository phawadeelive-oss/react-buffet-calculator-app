import { BrowserRouter, Routes, Route } from "react-router";
import Buffet from "./pages/Buffet";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Buffet />} />
      </Routes>
    </BrowserRouter>
  );
}
