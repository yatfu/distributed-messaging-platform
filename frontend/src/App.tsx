import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import ChatroomForm from "./components/chatroomForm";
import ChatroomPage from "./pages/chatroomPage";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <ChatroomForm />
      <Routes>
        <Route path="/chatrooms/:chatroomId" element={<ChatroomPage />} />
      </Routes>
    </BrowserRouter>
  );
}
