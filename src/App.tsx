import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppInitializer from './components/AppInitializer'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminProtectedRoute from './components/auth/AdminProtectedRoute'
import DriverProtectedRoute from './components/auth/DriverProtectedRoute'
import Home from './pages/Home'
import Ride from './pages/Ride'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiesPolicy from './pages/CookiesPolicy'
import DriverRegistration from './pages/DriverRegistration'
import DriverLogin from './pages/DriverLogin'
import DriverDashboard from './pages/DriverDashboard'
import DriverEarnings from './pages/DriverEarnings'
import DriverForgotPassword from './pages/DriverForgotPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminDrivers from './pages/AdminDrivers'
import MapTest from './pages/MapTest'

function App() {
  return (
    <AppInitializer>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="cookies" element={<CookiesPolicy />} />
          </Route>
          {/* Ride page without layout (full screen map) - Protected */}
          <Route path="/ride" element={
            <ProtectedRoute>
              <Ride />
            </ProtectedRoute>
          } />
          {/* Map test page for debugging */}
          <Route path="/maptest" element={<MapTest />} />
          {/* Driver routes without layout */}
          <Route path="/driver/register" element={<DriverRegistration />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/dashboard" element={
            <DriverProtectedRoute>
              <DriverDashboard />
            </DriverProtectedRoute>
          } />
          <Route path="/driver/earnings" element={
            <DriverProtectedRoute>
              <DriverEarnings />
            </DriverProtectedRoute>
          } />
          <Route path="/driver/forgot-password" element={<DriverForgotPassword />} />
          
          {/* Admin routes without layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/drivers" element={
            <AdminProtectedRoute>
              <AdminDrivers />
            </AdminProtectedRoute>
          } />
        </Routes>
      </Router>
    </AppInitializer>
  )
}

export default App