import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { ArrowRight, Zap, Shield, Smartphone, Star, Users, Rocket, Globe } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Average pickup time under 3 minutes. Our AI-powered matching connects you with the nearest driver instantly.',
      gradient: 'from-secondary-400 to-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safety First',
      description: 'Real-time GPS tracking, emergency assistance, and thoroughly vetted drivers ensure your peace of mind.',
      gradient: 'from-success-400 to-success-600',
      bgColor: 'bg-success-100',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Smart Technology',
      description: 'Intuitive app with live tracking, fare estimation, and seamless payment integration for effortless rides.',
      gradient: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-100',
    },
  ]

  const stats = [
    { 
      icon: <Users className="w-6 h-6" />, 
      value: '10M+', 
      label: 'Happy Riders',
      gradient: 'from-primary-100 to-primary-200',
      iconColor: 'text-primary-600'
    },
    { 
      icon: <Globe className="w-6 h-6" />, 
      value: '500+', 
      label: 'Cities',
      gradient: 'from-secondary-100 to-secondary-200',
      iconColor: 'text-secondary-600'
    },
    { 
      icon: <Star className="w-6 h-6" />, 
      value: '4.9', 
      label: 'Average Rating',
      gradient: 'from-warning-100 to-warning-200',
      iconColor: 'text-warning-600'
    },
    { 
      icon: <Rocket className="w-6 h-6" />, 
      value: '2M+', 
      label: 'Rides Completed',
      gradient: 'from-success-100 to-success-200',
      iconColor: 'text-success-600'
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-neutral-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neutral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-neutral-100 rounded-full text-neutral-700 text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Now available in your city
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Your Ride is Just a
                <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"> Tap Away</span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-neutral-600 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Experience the future of transportation. Safe, reliable, and affordable rides whenever you need them.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button size="lg" className="group shadow-lg">
                  Book a Ride Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="border-2 hover:bg-primary-50">
                  Become a Driver
                </Button>
              </motion.div>
            </div>
            
            {/* Right Content - Modern Illustration */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">John Driver</p>
                        <p className="text-sm text-neutral-500">⭐ 4.9 • 2 min away</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">$12.50</p>
                      <p className="text-sm text-neutral-500">8 min ride</p>
                    </div>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">Driver is on the way...</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                    <Zap className="w-6 h-6 mb-2" />
                    <p className="text-sm font-medium">Fast Pickup</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                    <Shield className="w-6 h-6 mb-2" />
                    <p className="text-sm font-medium">Safe Rides</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50/50">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center ${stat.iconColor} mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2">{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-primary-50/30">
        <div className="container">
          <div className="text-center mb-20">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              How <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">HoppOn</span> Works
            </motion.h2>
            <motion.p
              className="text-xl text-neutral-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Getting a ride has never been easier. Just three simple steps to your destination.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-primary-500 transform -translate-y-1/2" />
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-primary-500 transform -translate-y-1/2" />

            {/* Step 1 */}
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-2xl">
                  1
                </div>
                <div className="absolute -inset-4 bg-primary-200 rounded-full opacity-20 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Request a Ride</h3>
              <p className="text-neutral-600 leading-relaxed">
                Open the app, enter your destination, and choose your ride type. Our smart algorithm finds the best match.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-2xl">
                  2
                </div>
                <div className="absolute -inset-4 bg-primary-200 rounded-full opacity-20 animate-pulse animation-delay-2000" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Get Matched</h3>
              <p className="text-neutral-600 leading-relaxed">
                We connect you with a nearby driver. Track their location in real-time and see their estimated arrival.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-2xl">
                  3
                </div>
                <div className="absolute -inset-4 bg-primary-200 rounded-full opacity-20 animate-pulse animation-delay-4000" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Enjoy Your Ride</h3>
              <p className="text-neutral-600 leading-relaxed">
                Hop in and relax! Payment is automatic, and you can rate your experience when you arrive.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Driver Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-primary-100 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                For Drivers
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Drive with HoppOn & 
                <span className="text-secondary-300"> Earn More</span>
              </h2>
              
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Join thousands of drivers earning flexible income on their own schedule. 
                Drive when you want, where you want.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Competitive Earnings</h4>
                    <p className="text-primary-200">Earn up to $25/hour during peak times</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Instant Payouts</h4>
                    <p className="text-primary-200">Get paid instantly after each ride</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Full Support</h4>
                    <p className="text-primary-200">24/7 driver support and insurance coverage</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-100 shadow-lg">
                Start Driving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Right Content - Driver Dashboard */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="bg-white rounded-2xl p-6 text-neutral-900">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Today's Earnings</h3>
                      <p className="text-neutral-500">March 15, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-success-600">$247.50</p>
                      <p className="text-sm text-neutral-500">12 rides completed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <p className="text-sm text-neutral-600">Online Time</p>
                      <p className="text-xl font-bold text-neutral-700">8h 30m</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <p className="text-sm text-neutral-600">Rating</p>
                      <p className="text-xl font-bold text-neutral-700">4.9 ⭐</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-neutral-600">Peak Hours Bonus</span>
                      <span className="font-semibold text-success-600">+$45.00</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-neutral-600">Tips Received</span>
                      <span className="font-semibold text-success-600">+$23.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home