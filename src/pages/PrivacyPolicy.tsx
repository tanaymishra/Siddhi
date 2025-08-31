import React from 'react'
import { motion } from 'framer-motion'

const PrivacyPolicy: React.FC = () => {
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
              Privacy <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-neutral-600">
              Last updated: March 15, 2025
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Information We Collect</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We collect information you provide directly to us, information we obtain automatically when you use our services, 
                and information from other sources.
              </p>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 mb-4">
                <li>Name, email address, and phone number</li>
                <li>Profile photo and payment information</li>
                <li>Driver's license and vehicle information (for drivers)</li>
                <li>Emergency contact information</li>
              </ul>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Location Information</h3>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Precise location data when using our services</li>
                <li>Trip routes and destinations</li>
                <li>Pickup and drop-off locations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Connect riders with drivers and facilitate transportation services</li>
                <li>Process payments and send receipts</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important updates about your rides and account</li>
                <li>Improve our services through data analysis</li>
                <li>Ensure safety and security of our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Information Sharing</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">With Drivers and Riders</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We share necessary information between riders and drivers to facilitate rides, including names, 
                photos, vehicle information, and location data.
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">With Service Providers</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We work with third-party service providers for payment processing, background checks, 
                customer support, and analytics.
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Legal Requirements</h3>
              <p className="text-neutral-700 leading-relaxed">
                We may disclose information when required by law, to protect our rights, or to ensure user safety.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Data Security</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Your Rights and Choices</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                You have several rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Data Retention</h2>
              <p className="text-neutral-700 leading-relaxed">
                We retain your information for as long as necessary to provide our services, comply with legal obligations, 
                resolve disputes, and enforce our agreements. Trip data is typically retained for 7 years for tax and 
                regulatory purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. International Transfers</h2>
              <p className="text-neutral-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure 
                appropriate safeguards are in place to protect your information during international transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Children's Privacy</h2>
              <p className="text-neutral-700 leading-relaxed">
                Our services are not intended for children under 18. We do not knowingly collect personal information 
                from children under 18. If we become aware of such collection, we will delete the information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-neutral-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                posting the new policy on our website and through the app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Contact Us</h2>
              <p className="text-neutral-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
                <p className="text-neutral-700">
                  <strong>Email:</strong> privacy@swiftride.com<br />
                  <strong>Phone:</strong> 1-800-SWIFT-1<br />
                  <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105<br />
                  <strong>Data Protection Officer:</strong> dpo@swiftride.com
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy