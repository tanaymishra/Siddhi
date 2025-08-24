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
            About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're passionate about creating exceptional digital experiences that make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                To empower developers and businesses with modern, accessible, and performant web solutions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>
                A world where technology serves humanity through thoughtful design and inclusive development.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Founded with the belief that great software should be accessible to everyone, we've been 
            dedicated to creating tools and experiences that bridge the gap between complex technology 
            and human needs.
          </p>
          <p className="text-gray-600">
            Our team combines years of experience in design, development, and user experience to 
            deliver solutions that not only work beautifully but also make a positive impact on 
            the people who use them.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default About