import React from 'react'
import { motion } from 'framer-motion'

const TermsOfService: React.FC = () => {
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
              Terms of <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-xl text-neutral-600">
              Last updated: March 15, 2025
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-700 leading-relaxed">
                By accessing and using HoppOn's services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Service Description</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                HoppOn provides a technology platform that connects passengers with independent transportation providers. 
                We do not provide transportation services directly but facilitate connections between users and drivers.
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Ride-hailing services through our mobile application</li>
                <li>Real-time GPS tracking and navigation</li>
                <li>Secure payment processing</li>
                <li>Customer support services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. User Responsibilities</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                As a user of HoppOn services, you agree to:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Provide accurate and complete information when creating your account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Treat drivers and other users with respect and courtesy</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Pay all fees and charges associated with your use of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Driver Requirements</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Drivers using the HoppOn platform must:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Hold a valid driver's license and vehicle registration</li>
                <li>Maintain appropriate insurance coverage</li>
                <li>Pass background checks and vehicle inspections</li>
                <li>Provide safe and reliable transportation services</li>
                <li>Comply with all local transportation regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Payment Terms</h2>
              <p className="text-neutral-700 leading-relaxed">
                Payment for rides is processed automatically through the app. Fees are calculated based on distance, time, 
                and demand. Additional charges may apply for tolls, airport fees, or other surcharges. Refunds are handled 
                on a case-by-case basis according to our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-neutral-700 leading-relaxed">
                HoppOn's liability is limited to the maximum extent permitted by law. We are not liable for any indirect, 
                incidental, special, or consequential damages arising from your use of our services. Our total liability 
                shall not exceed the amount paid by you for the specific service giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Termination</h2>
              <p className="text-neutral-700 leading-relaxed">
                Either party may terminate this agreement at any time. HoppOn reserves the right to suspend or terminate 
                accounts that violate these terms or engage in fraudulent or harmful activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Changes to Terms</h2>
              <p className="text-neutral-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes 
                through the app or email. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Contact Information</h2>
              <p className="text-neutral-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
                <p className="text-neutral-700">
                  <strong>Email:</strong> legal@hoppon.com<br />
                  <strong>Phone:</strong> 1-800-HOPPON-1<br />
                  <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService