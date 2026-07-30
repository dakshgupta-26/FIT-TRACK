import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Search,
  Phone,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Keep your existing fetchNearbyGyms and OSMGym interface ---
const fetchNearbyGyms = async (lat: number, lon: number, radius: number = 5000) => {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      way["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      relation["leisure"="fitness_centre"](around:${radius},${lat},${lon});
    );
    out center meta;
  `;
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });
    if (!response.ok) throw new Error('Failed to fetch gym data');
    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    console.error('Error fetching gyms from Overpass API:', error);
    return [];
  }
};

interface OSMGym {
  id: number;
  type: string;
  lat: number;
  lon: number;
  tags?: { [key: string]: any; name?: string; 'name:en'?: string; 'addr:full'?: string; 'addr:street'?: string; 'addr:city'?: string; phone?: string; website?: string; opening_hours?: string; sport?: string; };
  center?: { lat: number; lon: number; };
}
// ---

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  distance: number;
  isOpen?: boolean;
  hours?: string;
  phone?: string;
  website?: string;
  amenities?: string[];
  price?: string;
  type: string;
}

const mockGyms: Gym[] = [
    { id: '1', name: 'Gold\'s Gym', address: 'Model Colony, Pune', latitude: 18.5393, longitude: 73.834, rating: 4.3, distance: 3.0, isOpen: true, hours: 'Mo-Su 06:00-22:00', phone: '+91 9158026123', website: 'https://goldsgym.in', amenities: ['fitness', 'yoga', 'zumba', 'weightlifting', 'crossfit'], price: 'Contact for pricing', type: 'Full Service' },
    { id: '2', name: 'Endure Fitness Club - Satara Road', address: 'Satara Road, Pune', latitude: 18.472, longitude: 73.861, rating: 4.6, distance: 2.4, isOpen: true, hours: 'Mo-Su 05:00-21:00', phone: '+91 9158026124', website: 'https://endurefitness.com', amenities: ['crossfit', 'weightlifting'], price: 'Contact for pricing', type: 'CrossFit' },
];

// FIXED: This function now correctly formats the address to avoid stray commas.
const convertOSMToGym = (osmGym: OSMGym, userLat: number, userLon: number): Gym => {
    const lat = osmGym.lat || osmGym.center?.lat || 0;
    const lon = osmGym.lon || osmGym.center?.lon || 0;
    
    const R = 3959; // miles
    const dLat = (lat - userLat) * Math.PI / 180;
    const dLon = (lon - userLon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    const name = osmGym.tags?.name || osmGym.tags?.['name:en'] || 'Fitness Center';
    
    // FIXED: Build address safely to avoid stray commas
    const addressParts = [
        osmGym.tags?.['addr:street'],
        osmGym.tags?.['addr:housenumber'],
        osmGym.tags?.['addr:suburb'],
        osmGym.tags?.['addr:city']
    ].filter(Boolean); // This removes any empty or null parts
    const address = osmGym.tags?.['addr:full'] || addressParts.join(', ');

    return {
      id: osmGym.id.toString(),
      name,
      address: address || 'Address not available', // Provide a fallback
      latitude: lat,
      longitude: lon,
      distance: parseFloat(distance.toFixed(1)),
      type: osmGym.tags?.sport || 'Fitness',
      phone: osmGym.tags?.phone,
      website: osmGym.tags?.website,
      hours: osmGym.tags?.opening_hours || 'Hours not available',
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
      isOpen: true,
      amenities: ['fitness', 'yoga', 'zumba'],
      price: 'Contact for pricing',
    };
};

const GymDetailCard = ({ gym, onBack, onNavigate }: { gym: Gym; onBack: () => void; onNavigate: (lat: number, lon: number) => void; }) => (
    <motion.div
      key="detail-card"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="bg-card h-full flex flex-col p-4 rounded-lg"
    >
      <Button variant="ghost" onClick={onBack} className="self-start mb-4 text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back to list
      </Button>
      {/* ... (rest of detail card remains the same) ... */}
      <div className="flex-grow">
        <h2 className="text-2xl font-bold">{gym.name}</h2>
        <p className="text-muted-foreground my-4 text-sm">{gym.address}</p>
        <div className="flex items-center gap-4 text-sm mb-6 p-2 bg-background rounded-md">
            <span className="flex items-center font-semibold"><Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" /> {gym.rating || 'N/A'}</span>
            <span className="flex items-center"><MapPin size={16} className="mr-1" /> {gym.distance} mi</span>
            {gym.isOpen ? <Badge className="bg-green-500 hover:bg-green-600 text-white">Open</Badge> : <Badge variant="destructive">Closed</Badge>}
        </div>
        <div className="space-y-4 text-sm">
            <div className="flex items-center"><Clock size={16} className="mr-3 text-primary" />{gym.hours}</div>
            <div className="flex items-center"><Phone size={16} className="mr-3 text-primary" />{gym.phone || 'N/A'}</div>
            <div className="flex items-center"><Globe size={16} className="mr-3 text-primary" />
                {gym.website ? <a href={gym.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{gym.website}</a> : 'N/A'}
            </div>
            <p className="pt-2">{gym.price}</p>
        </div>
      </div>
      <Button size="lg" className="w-full mt-6" onClick={() => onNavigate(gym.latitude, gym.longitude)}>
        <Navigation size={18} className="mr-2" /> Navigate
      </Button>
    </motion.div>
);

const NearbyGyms: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGyms, setIsLoadingGyms] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const getLocationAndGyms = async () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setIsLoading(false);
          setIsLoadingGyms(true);
          try {
            const osmElements = await fetchNearbyGyms(latitude, longitude);
            const convertedGyms = osmElements.length > 0
              ? osmElements.map((osmGym: OSMGym) => convertOSMToGym(osmGym, latitude, longitude))
              : mockGyms;
            setGyms(convertedGyms);
          } finally {
            setIsLoadingGyms(false);
          }
        }, () => {
          setUserLocation([-74.0059, 40.7128]);
          setGyms(mockGyms);
          setIsLoading(false);
        });
      };
      getLocationAndGyms();
  }, []);

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGym = (gym: Gym | null) => {
    setSelectedGym(gym);
    if (gym && mapRef.current) {
        mapRef.current.setView([gym.latitude, gym.longitude], 15);
    }
  };
  
  const handleNavigate = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Getting your location...</div>;
  }
  
  const initialMapCenter: [number, number] = userLocation ? [userLocation[1], userLocation[0]] : [18.5204, 73.8567]; // Default to Pune

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="text-left mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Nearby Gyms</h1>
        <p className="text-muted-foreground">Discover gyms near you • {filteredGyms.length} gyms found</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder="Search gyms..."
          className="pl-10 pr-4 py-3 w-full md:w-1/2 lg:w-1/3 rounded-lg bg-card border-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-md">
          <MapContainer 
              center={initialMapCenter}
              zoom={12}
              scrollWheelZoom={true}
              className="h-full w-full"
              ref={mapRef}
          >
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredGyms.map(gym => (
                  <Marker 
                      key={gym.id} 
                      position={[gym.latitude, gym.longitude]}
                      eventHandlers={{ click: () => handleSelectGym(gym) }}
                  >
                    <Popup>{gym.name}</Popup>
                  </Marker>
              ))}
          </MapContainer>
        </div>

        <div className="lg:col-span-1 h-full">
          <AnimatePresence mode="wait">
            {selectedGym ? (
              <GymDetailCard 
                  key={selectedGym.id}
                  gym={selectedGym} 
                  onBack={() => handleSelectGym(null)}
                  onNavigate={handleNavigate}
              />
            ) : (
              <motion.div
                  key="gym-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-y-auto h-full pr-2 space-y-3"
              >
                  <h2 className="text-2xl font-semibold mb-2">Gyms Found</h2>
                  {isLoadingGyms ? <p>Loading gyms...</p> : 
                      filteredGyms.map(gym => (
                          // IMPROVED: Card layout matches screenshot
                          <Card 
                              key={gym.id}
                              className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                              onClick={() => handleSelectGym(gym)}
                          >
                              <CardContent className="pt-4">
                                  <p className="font-bold text-lg">{gym.name}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{gym.address}</p>
                                  <div className="flex items-center justify-between mt-3 text-sm">
                                      <div className="flex items-center gap-1">
                                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                          <span className="font-semibold">{gym.rating || 'N/A'}</span>
                                      </div>
                                      <span className="text-muted-foreground">{gym.distance} mi</span>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                  }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NearbyGyms;