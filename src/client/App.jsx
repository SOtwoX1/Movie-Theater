import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import SignUpPage from "./pages/signup";
import InformationList from "./pages/UsersList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* HOMEPAGE NOT LOGIN */}
        <Route path="/register" element={<SignUpPage />} /> {/* REGISTER GO TO HOMEPAGE FOR LOGIN */}
        <Route path="/staffpage" element={<InformationList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
