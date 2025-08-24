import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg shadow-sm" />
                <span className="text-xl font-semibold text-neutral-900">Siddhi</span>
              </Link>
              <p className="text-neutral-600 text-sm max-w-md">
                Building modern, accessible, and performant web applications with the latest technologies.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-600">
              © 2025 Siddhi. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer