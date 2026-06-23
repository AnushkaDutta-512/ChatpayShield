import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BackgroundEffects from './components/ui/BackgroundEffects';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import { Login, Register } from './pages/auth';
import Dashboard from './pages/Dashboard';
import OCRScanner from './pages/OCRScanner';
import TransactionIntelligence from './pages/TransactionIntelligence';
import FraudAnalytics from './pages/FraudAnalytics';
import TransactionDetail from './pages/TransactionDetail';
import AICommandCenter from './pages/AICommandCenter';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BackgroundEffects />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ocr" element={<OCRScanner />} />
            <Route path="/transactions" element={<TransactionIntelligence />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/analytics" element={<FraudAnalytics />} />
            <Route path="/command-center" element={<AICommandCenter />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
