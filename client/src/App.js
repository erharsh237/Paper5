import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Home          from './pages/Home';
import Blog          from './pages/Blog';
import BlogPost      from './pages/BlogPost';
import Login         from './pages/Login';
import ServicePage   from './pages/ServicePage';
import Portfolio     from './pages/Portfolio';
import FAQ           from './pages/FAQ';
import Careers       from './pages/Careers';
import ResetPassword      from './pages/ResetPassword';
import APITester          from './pages/APITester';
import NotFound           from './pages/NotFound';
import WebsiteServicePage from './pages/WebsiteServicePage';

// Admin pages
import AdminLayout    from './pages/admin/AdminLayout';
import Dashboard      from './pages/admin/Dashboard';
import Leads          from './pages/admin/Leads';
import LeadDetail     from './pages/admin/LeadDetail';
import Posts          from './pages/admin/Posts';
import PostEditor     from './pages/admin/PostEditor';
import ChangePassword from './pages/admin/ChangePassword';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'var(--font-display)',fontSize:'1.5rem',color:'var(--muted)'}}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"                         element={<Home />} />
      <Route path="/blog"                     element={<Blog />} />
      <Route path="/blog/:slug"               element={<BlogPost />} />
      <Route path="/login"                    element={<Login />} />
      <Route path="/services/:slug"           element={<ServicePage />} />
      <Route path="/portfolio"                element={<Portfolio />} />
      <Route path="/faq"                      element={<FAQ />} />
      <Route path="/careers"                  element={<Careers />} />
      <Route path="/reset-password/:token"              element={<ResetPassword />} />
      <Route path="/api-tester"                          element={<APITester />} />
      <Route path="/services/website-designing/:subtype" element={<WebsiteServicePage />} />
      <Route path="*"                                    element={<NotFound />} />

      {/* Admin (protected) */}
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index                    element={<Dashboard />} />
        <Route path="leads"             element={<Leads />} />
        <Route path="leads/:id"         element={<LeadDetail />} />
        <Route path="posts"             element={<Posts />} />
        <Route path="posts/new"         element={<PostEditor />} />
        <Route path="posts/:id"         element={<PostEditor />} />
        <Route path="change-password"   element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-body)', fontSize: '0.88rem' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
