import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppInitializer from './components/AppInitializer'
import Layout from './components/layout/Layout'
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
import DriverForgotPassword from './pages/DriverForgotPassword'
import MapTest from './pages/MapTest'
import Confirmed from './pages/Confirmed'

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
          {/* Ride page without layout (full screen map) */}
          <Route path="/ride" element={<Ride />} />
          {/* Confirmed page without layout */}
          <Route path="/confirmed/:id" element={<Confirmed />} />
          {/* Map test page for debugging */}
          <Route path="/maptest" element={<MapTest />} />
          {/* Driver routes without layout */}
          <Route path="/driver/register" element={<DriverRegistration />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/forgot-password" element={<DriverForgotPassword />} />
        </Routes>
      </Router>
    </AppInitializer>
  )
}

export default App