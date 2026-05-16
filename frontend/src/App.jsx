import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PublicChaiPage from './pages/PublicChaiPage.jsx';
import TOSPage from './pages/TOSPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

// Wrapper so we can read location inside BrowserRouter
function AppLayout() {
  const location = useLocation();
  // These pages have their own full-screen layout (no shared header/footer)
  const standalone = ['/dashboard', '/login'].includes(location.pathname) ||
    (location.pathname !== '/' &&
      location.pathname !== '/terms' &&
      location.pathname !== '/privacy' &&
      location.pathname !== '/contact' &&
      location.pathname !== '/404' &&
      !location.pathname.startsWith('/terms') &&
      !location.pathname.startsWith('/privacy') &&
      !location.pathname.startsWith('/contact'));

  const showHeaderFooter = ['/','','/terms','/privacy','/contact'].includes(location.pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TOSPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/:username" element={<PublicChaiPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
