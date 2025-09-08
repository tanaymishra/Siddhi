export interface CarType {
  id: string
  name: string
  description: string
  image: string
  baseRate: number // Rate per km
  capacity: number
  features: string[]
}

export const CAR_TYPES: CarType[] = [
  {
    id: 'taxi',
    name: 'Taxi',
    description: 'Affordable rides for everyday travel',
    image: '/taxi.png',
    baseRate: 12, // ₹12 per km
    capacity: 4,
    features: ['AC', 'Comfortable seating', 'Budget-friendly']
  },
  {
    id: 'sedan',
    name: 'Sedan',
    description: 'Premium comfort for business trips',
    image: '/sedan.png',
    baseRate: 18, // ₹18 per km (50% more than taxi)
    capacity: 4,
    features: ['AC', 'Premium interior', 'Professional drivers', 'Extra legroom']
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury experience with top-tier vehicles',
    image: '/premium.png',
    baseRate: 25, // ₹25 per km (108% more than taxi)
    capacity: 4,
    features: ['AC', 'Luxury interior', 'Premium amenities', 'Top-rated drivers', 'Complimentary water']
  }
]

export const getCarTypeById = (id: string): CarType | undefined => {
  return CAR_TYPES.find(carType => carType.id === id)
}

export const calculateFareByCarType = (distanceInKm: number, carTypeId: string): number => {
  const carType = getCarTypeById(carTypeId)
  if (!carType) return 0
  return Math.round(distanceInKm * carType.baseRate)
}