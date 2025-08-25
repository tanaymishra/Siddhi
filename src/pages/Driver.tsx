import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Car, 
  DollarSign, 
  Clock, 
  Shield, 
  Star, 
  Users, 
  CheckCircle,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

const Driver: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [formData, setFormDa