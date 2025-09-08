import React from 'react'
import { motion } from 'framer-motion'
import { Users, Check } from 'lucide-react'
import { CAR_TYPES, type CarType } from '../types/carTypes'

interface CarTypeSelectorProps {
  selectedCarType: string
  onCarTypeSelect: (carTypeId: string) => void
  distanceInKm: number
  className?: string
}

const CarTypeSelector: React.FC<CarTypeSelectorProps> = ({
  selectedCarType,
  onCarTypeSelect,
  distanceInKm,
  className = ""
}) => {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Choose your ride</h3>
      
      {/* Car types container - no longer scrollable */}
      <div className="space-y-3">
        {CAR_TYPES.map((carType, index) => {
          const fare = Math.round(distanceInKm * carType.baseRate)
          const isSelected = selectedCarType === carType.id
          
          return (
            <motion.div
              key={carType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
              }`}
              onClick={() => onCarTypeSelect(carType.id)}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                {/* Car image - bigger */}
                <div className="flex-shrink-0">
                  <img 
                    src={carType.image} 
                    alt={carType.name}
                    className="w-16 h-12 object-contain"
                  />
                </div>
                
                {/* Car details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-semibold text-neutral-900">{carType.name}</h4>
                    <div className="text-right">
                      <p className="text-base font-bold text-neutral-900">₹{fare}</p>
                      <p className="text-xs text-neutral-500">₹{carType.baseRate}/km</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3">{carType.description}</p>
                  
                  {/* Capacity and features */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-neutral-500">
                      <Users className="w-4 h-4" />
                      <span>{carType.capacity} seats</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {carType.features.slice(0, 2).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {carType.features.length > 2 && (
                        <span className="text-xs text-neutral-500">
                          +{carType.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default CarTypeSelector