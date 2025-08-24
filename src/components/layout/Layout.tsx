import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import AuthModal from '../auth/AuthModal'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <AuthModal />
    </div>
  )
}

export default Layout