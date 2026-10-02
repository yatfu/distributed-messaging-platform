import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import ChatroomPage from "./pages/ChatroomPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatrooms/:chatroomId" element={<ChatroomPage />} />
      </Routes>
    </BrowserRouter>
  );
}
