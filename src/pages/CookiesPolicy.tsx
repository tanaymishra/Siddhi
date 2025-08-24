import React from 'react'
import { motion } from 'framer-motion'

const CookiesPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="container py-20">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Cookies <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-neutral-600">
              Last updated: March 15, 2025
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-neutral-700 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website or use our mobile application. 
                They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary-500 pl-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Essential Cookies</h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    These cookies are necessary for our website and app to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc list-inside text-neutral-700 space-y-1">
                    <li>Authentication and login status</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                    <li>Basic website functionality</li>
                  </ul>
                </div>

                <div className="border-l-4 border-secondary-500 pl-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Performance Cookies</h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    These cookies help us understand how visitors interact with our website and app, allowing us to improve performance.
                  </p>
                  <ul className="list-disc list-inside text-neutral-700 space-y-1">
                    <li>Page load times and performance metrics</li>
                    <li>Error tracking and debugging</li>
                    <li>Usage analytics and statistics</li>
                    <li>Feature usage and adoption rates</li>
                  </ul>
                </div>

                <div className="border-l-4 border-success-500 pl-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Functional Cookies</h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                  <ul className="list-disc list-inside text-neutral-700 space-y-1">
                    <li>Language and region preferences</li>
                    <li>Saved addresses and favorite locations</li>
                    <li>Display preferences and settings</li>
                    <li>Accessibility options</li>
                  </ul>
                </div>

                <div className="border-l-4 border-warning-500 pl-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Marketing Cookies</h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
                  </p>
                  <ul className="list-disc list-inside text-neutral-700 space-y-1">
                    <li>Targeted advertising and promotions</li>
                    <li>Social media integration</li>
                    <li>Campaign performance tracking</li>
                    <li>Cross-platform user identification</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Third-Party Cookies</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We work with trusted third-party partners who may also set cookies on your device. These include:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Payment Processors:</strong> For secure payment processing (Stripe, PayPal)</li>
                <li><strong>Social Media Platforms:</strong> For social login and sharing features</li>
                <li><strong>Customer Support:</strong> For chat support and help desk functionality</li>
                <li><strong>Advertising Networks:</strong> For targeted advertising and remarketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Managing Your Cookie Preferences</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                You have several options for managing cookies:
              </p>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Browser Settings</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 mb-6">
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Cookie Consent Manager</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                When you first visit our website, you'll see a cookie consent banner where you can:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your preferences by cookie category</li>
                <li>Change your preferences at any time through our cookie settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Mobile App Data Collection</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Our mobile app may collect similar information through:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Device identifiers and advertising IDs</li>
                <li>App usage analytics</li>
                <li>Crash reports and performance data</li>
                <li>Push notification preferences</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed">
                You can manage these preferences through your device settings or within the app's privacy settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Cookie Retention</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
                <li><strong>Essential Cookies:</strong> May persist until you delete them or change your settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                While you can disable cookies, please note that this may affect your experience:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Some features may not work properly</li>
                <li>You may need to re-enter information frequently</li>
                <li>Personalized content and recommendations may not be available</li>
                <li>Website performance may be reduced</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Updates to This Policy</h2>
              <p className="text-neutral-700 leading-relaxed">
                We may update this Cookies Policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Contact Us</h2>
              <p className="text-neutral-700 leading-relaxed">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
                <p className="text-neutral-700">
                  <strong>Email:</strong> privacy@hoppon.com<br />
                  <strong>Phone:</strong> 1-800-HOPPON-1<br />
                  <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105<br />
                  <strong>Cookie Settings:</strong> Available in your account preferences
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CookiesPolicy