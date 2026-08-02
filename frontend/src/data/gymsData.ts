export interface Trainer {
  name: string;
  role: string;
  photo: string;
  bio: string;
}

export interface MembershipPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  recommended?: boolean;
}

export interface GymData {
  id: string;
  name: string;
  tagline: string;
  category: 'Gym' | 'CrossFit' | 'Yoga' | 'Recovery' | 'Cafe' | 'Swimming';
  address: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  rating: number;
  reviewCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  priceDetails: string;
  occupancyPercent: number;
  occupancyStatus: 'Low Crowd' | 'Moderate' | 'Peak Hours';
  isOpen: boolean;
  hoursText: string;
  aiMatchScore: number;
  aiReason: string;
  heroImage: string;
  galleryImages: string[];
  amenities: string[];
  equipment: string[];
  phone: string;
  website: string;
  temperature: string;
  aqi: number;
  peakHours: number[];
  trainers: Trainer[];
  plans: MembershipPlan[];
  isTrending?: boolean;
  isAiPick?: boolean;
  isRecovery?: boolean;
  isCafe?: boolean;
  hasFreeTrial?: boolean;
}

export const sampleGyms: GymData[] = [
  {
    id: 'gym-1',
    name: 'AURA Performance & Recovery Club',
    tagline: 'Luxury Biometric Training & Cryotherapy Sanctuary',
    category: 'Gym',
    address: '450 Montgomery St, Financial District, SF',
    latitude: 37.7925,
    longitude: -122.4035,
    distanceMiles: 0.8,
    rating: 4.9,
    reviewCount: 342,
    priceLevel: '$$$$',
    priceDetails: '$120/mo • $25 Day Pass',
    occupancyPercent: 24,
    occupancyStatus: 'Low Crowd',
    isOpen: true,
    hoursText: 'Open 24/7 • Full Telemetry Active',
    aiMatchScore: 98,
    aiReason: '98% Match for Muscle Gain & Hypertrophy. Equipped with 6 Eleiko platforms, cold plunge, and low occupancy at your typical 7 PM session.',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['Infrared Sauna', 'Ice Plunge', 'High-Protein Bar', 'Olympic Platforms', '24/7 Access', 'Towel Service', 'Biometric Scanners', 'Valet Parking'],
    equipment: ['Eleiko IWF Racks', 'Hammer Strength Iso-Lateral', 'Concept2 Skierg', 'Keiser Pneumatic Cable', 'InBody 770 Composition Scanner'],
    phone: '+1 (415) 890-2100',
    website: 'https://auraperformance.io',
    temperature: '21°C',
    aqi: 14,
    peakHours: [15, 25, 40, 75, 88, 65, 45, 24, 15],
    trainers: [
      { name: 'Dr. Marcus Vance', role: 'Head of Biomechanics', photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop', bio: 'CSCS, PhD in Human Kinetics. Specialized in hyper-trophy periodization.' },
      { name: 'Elena Rostova', role: 'Olympic Lifting Coach', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', bio: 'Former National Weightlifting Champion & Movement Specialist.' }
    ],
    plans: [
      { name: 'VIP Day Pass', price: '$25', period: 'per day', features: ['Full Gym & Recovery Access', 'Infrared Sauna & Ice Plunge', 'Free Protein Shake'] },
      { name: 'Elite All-Access', price: '$120', period: 'per month', features: ['24/7 Unlimited Access', 'Monthly InBody 770 Scan', 'Guest Passes', 'Recovery Lounge Unlimited'], recommended: true }
    ],
    isTrending: true,
    isAiPick: true,
    hasFreeTrial: true,
  },
  {
    id: 'gym-2',
    name: 'TITAN Heavy Metal & Powerlifting',
    tagline: 'Old-School Hardcore Gym with Modern Biometrics',
    category: 'Gym',
    address: '890 Brannan St, SoMa, San Francisco',
    latitude: 37.7712,
    longitude: -122.4048,
    distanceMiles: 1.4,
    rating: 4.8,
    reviewCount: 289,
    priceLevel: '$$',
    priceDetails: '$59/mo • $15 Day Pass',
    occupancyPercent: 58,
    occupancyStatus: 'Moderate',
    isOpen: true,
    hoursText: 'Open 05:00 - 23:00 Daily',
    aiMatchScore: 95,
    aiReason: '95% Match for Strength & Powerlifting. 12 Rogue Racks, calibrated steel plates, and chalk allowed.',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['12 Rogue Racks', 'Calibrated Steel Plates', 'Chalk Allowed', 'Heavy Dumbbells (up to 150lbs)', 'Powerlifting Platforms', 'Locker Room'],
    equipment: ['Rogue Monster Racks', 'Kabuki Strength Bars', 'Ghost Strong Benches', 'Pit Shark Belt Squat'],
    phone: '+1 (415) 554-9020',
    website: 'https://titangymsf.com',
    temperature: '19°C',
    aqi: 22,
    peakHours: [20, 35, 60, 85, 92, 70, 58, 30, 15],
    trainers: [
      { name: 'Jake "The Tank" Miller', role: 'Powerlifting Specialist', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', bio: '800lb Deadlifter & IPF Certified Strength Coach.' }
    ],
    plans: [
      { name: 'Standard Monthly', price: '$59', period: 'per month', features: ['Full Gym Access', 'Free Chalk & Belts Use', 'Locker Room'] }
    ],
    isTrending: true,
    hasFreeTrial: true,
  },
  {
    id: 'gym-3',
    name: 'ZENITH Bio-Yoga & Infrared Studio',
    tagline: 'Thermal Infrared Flow & Somatic Breathwork',
    category: 'Yoga',
    address: '1200 Gough St, Pacific Heights, SF',
    latitude: 37.7854,
    longitude: -122.4241,
    distanceMiles: 1.9,
    rating: 4.95,
    reviewCount: 198,
    priceLevel: '$$$',
    priceDetails: '$89/mo • $20 Single Class',
    occupancyPercent: 18,
    occupancyStatus: 'Low Crowd',
    isOpen: true,
    hoursText: 'Open 06:00 - 21:00 Daily',
    aiMatchScore: 92,
    aiReason: '92% Recovery Score Match. Recommended because your smartwatch detected high HRV stress levels yesterday.',
    heroImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['Infrared Radiant Heat', 'Manduka Pro Mats Included', 'Eucalyptus Steam Shower', 'Organic Tea Lounge', 'Somatic Sound Baths'],
    equipment: ['Infrared Heaters', 'Yoga Props & Bolsters', 'Sound Healing Bowls'],
    phone: '+1 (415) 771-4400',
    website: 'https://zenithyoga.io',
    temperature: '28°C',
    aqi: 9,
    peakHours: [10, 20, 30, 45, 60, 40, 18, 10, 5],
    trainers: [
      { name: 'Sora Takahashi', role: 'Lead Somatic Instructor', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', bio: '500-hr RYT certified with 12 years in Vinyasa and Breathwork.' }
    ],
    plans: [
      { name: 'Unlimited Yoga Pass', price: '$89', period: 'per month', features: ['Unlimited Classes', 'Infrared Sauna Access', 'Mat & Towel Rental Included'] }
    ],
    isAiPick: true,
    isRecovery: true,
    hasFreeTrial: true,
  },
  {
    id: 'gym-4',
    name: 'KINETIC CrossFit Lab & Endurance',
    tagline: 'High-Intensity Functional Fitness & Metric Analytics',
    category: 'CrossFit',
    address: '650 Townsend St, Showplace Square, SF',
    latitude: 37.7718,
    longitude: -122.4001,
    distanceMiles: 1.1,
    rating: 4.85,
    reviewCount: 215,
    priceLevel: '$$$',
    priceDetails: '$135/mo Unlimited WOD',
    occupancyPercent: 82,
    occupancyStatus: 'Peak Hours',
    isOpen: true,
    hoursText: 'Open 05:30 - 20:30',
    aiMatchScore: 89,
    aiReason: '89% HIIT Compatibility. High intensity functional training with live heart-rate leaderboard tracking.',
    heroImage: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['60ft Rig', 'Assault Bikes', 'Concept2 Ergometers', 'Shower Facilities', 'Community Events', 'Olympic Weightlifting Platforms'],
    equipment: ['Rogue Monster Rigs', 'C2 Rowers & SkiErgs', 'Echo Bikes', 'Kettlebells (up to 48kg)'],
    phone: '+1 (415) 621-3311',
    website: 'https://kineticcrossfit.com',
    temperature: '20°C',
    aqi: 16,
    peakHours: [60, 85, 90, 70, 65, 82, 95, 40, 20],
    trainers: [
      { name: 'Coach Dave Vance', role: 'Head CrossFit L3 Coach', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', bio: '10x CrossFit Games Regional Athlete.' }
    ],
    plans: [
      { name: 'Unlimited WOD Pass', price: '$135', period: 'per month', features: ['Unlimited CrossFit Classes', 'Open Gym Access', 'Heart Rate Telemetry Sync'] }
    ],
    isTrending: true,
  },
  {
    id: 'gym-5',
    name: 'CRYO-PULSE Bio-Recovery & Ice Lab',
    tagline: 'Cryotherapy, Hyperbaric Oxygen & Contrast Therapy',
    category: 'Recovery',
    address: '300 Post St, Union Square, SF',
    latitude: 37.7887,
    longitude: -122.4075,
    distanceMiles: 0.5,
    rating: 4.98,
    reviewCount: 164,
    priceLevel: '$$$$',
    priceDetails: '$150/mo • $45 Session Pass',
    occupancyPercent: 12,
    occupancyStatus: 'Low Crowd',
    isOpen: true,
    hoursText: 'Open 08:00 - 20:00 Daily',
    aiMatchScore: 97,
    aiReason: '97% Match for Muscle Recovery. Recommended for post-leg day inflammation reduction.',
    heroImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['Whole Body Cryotherapy (-160°C)', 'Infrared Sauna Pods', 'Hyperbaric Oxygen Chambers', 'Normatec Compression Boots', 'Red Light Therapy Panel'],
    equipment: ['Impact Cryo Chamber', 'Mild HBOT Chamber', 'Normatec 3 Pulse Boots'],
    phone: '+1 (415) 398-9000',
    website: 'https://cryopulse.io',
    temperature: '18°C',
    aqi: 8,
    peakHours: [10, 15, 20, 30, 40, 35, 25, 12, 5],
    trainers: [
      { name: 'Dr. Sarah Lin', role: 'Recovery & Biohacking Specialist', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop', bio: 'Specialist in athletic recovery & cryotherapy protocol.' }
    ],
    plans: [
      { name: 'Full Recovery Unlimited', price: '$150', period: 'per month', features: ['Unlimited Cryo & Sauna', 'Normatec Boots Unlimited', 'Red Light Therapy'] }
    ],
    isAiPick: true,
    isRecovery: true,
    hasFreeTrial: true,
  },
  {
    id: 'gym-6',
    name: 'FUEL & MACROS Organic Fitness Cafe',
    tagline: 'High-Protein Fuel, Cold-Pressed Juices & Pre-Workout',
    category: 'Cafe',
    address: '500 Howard St, East Cut, SF',
    latitude: 37.7881,
    longitude: -122.3982,
    distanceMiles: 0.7,
    rating: 4.88,
    reviewCount: 412,
    priceLevel: '$$',
    priceDetails: '$8 - $18 Meal Bowls',
    occupancyPercent: 35,
    occupancyStatus: 'Low Crowd',
    isOpen: true,
    hoursText: 'Open 07:00 - 20:00 Daily',
    aiMatchScore: 94,
    aiReason: '94% Nutrition Match. High protein meal prep (45g+ protein per bowl) tailored for your post-workout window.',
    heroImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['Grass-Fed Protein Bowls', 'Custom Macro Creator', 'Fresh Cold-Pressed Juices', 'Electrolyte Slushies', 'High Speed Fiber WiFi', 'Outdoor Patio'],
    equipment: ['Macro Scanner Kiosks', 'Fresh Juice Press'],
    phone: '+1 (415) 901-7788',
    website: 'https://fuelandmacros.com',
    temperature: '22°C',
    aqi: 11,
    peakHours: [20, 50, 85, 40, 30, 60, 35, 15, 5],
    trainers: [],
    plans: [],
    isCafe: true,
  }
];
