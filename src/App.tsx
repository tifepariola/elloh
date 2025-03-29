import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from './pages/AuthPage';
import Inbox from './pages/Inbox';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
