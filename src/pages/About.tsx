import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

const About: React.FC = () => {
  return (
    <div className="container py-20">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About HoppOn
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're passionate about revolutionizing transportation and connecting communities through safe, reliable rides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                To make transportation accessible, safe, and efficient for everyone while creating economic opportunities for drivers worldwide.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>
                A world where getting from point A to point B is seamless, sustainable, and strengthens communities through shared mobility.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Founded with the belief that transportation should be reliable and accessible to everyone, we've been 
            dedicated to connecting riders with trusted drivers through innovative technology that prioritizes 
            safety and convenience.
          </p>
          <p className="text-gray-600">
            Our team combines years of experience in transportation, technology, and community building to 
            deliver rides that are not only fast and affordable but also create meaningful economic 
            opportunities for drivers in cities worldwide.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default About