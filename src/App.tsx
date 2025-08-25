import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AuthPage from './pages/AuthPage';
import Contacts from './pages/Contacts';
import Inbox from './pages/Inbox';
import Layout from './pages/Layout';
import SettingsPage from "./pages/Settings";
import { AuthProvider } from './store/authContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <Layout>
                <Inbox />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/contacts" element={
            <ProtectedRoute>
              <Layout>
                <Contacts />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="*" element={<Navigate to="/inbox" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
