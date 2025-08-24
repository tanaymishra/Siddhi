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
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  HoppOn
                </span>
              </Link>
              <p className="text-neutral-600 text-sm max-w-md mb-4">
                Your reliable ride-sharing partner. Safe, fast, and affordable transportation whenever you need it.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Riders */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">For Riders</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/ride" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Book a Ride
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Drivers */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">For Drivers</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/drive" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Drive with HoppOn
                  </Link>
                </li>
                <li>
                  <Link to="/driver-requirements" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Requirements
                  </Link>
                </li>
                <li>
                  <Link to="/driver-earnings" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Earnings
                  </Link>
                </li>
                <li>
                  <Link to="/driver-support" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    Driver Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-600">
              © 2025 HoppOn. All rights reserved. • Connecting riders and drivers worldwide.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer