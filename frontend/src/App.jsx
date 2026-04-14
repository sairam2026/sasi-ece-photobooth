import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1C2130',
              color: '#fff',
              border: '1px solid #2E374D',
              borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#F4B942', secondary: '#1C2130' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#1C2130' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
