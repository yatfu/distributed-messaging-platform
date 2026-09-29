import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import ChatroomPage from "./pages/chatroomPage";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/chatrooms/:chatroomId" element={<ChatroomPage />} />
      </Routes>
    </BrowserRouter>
  );
}
