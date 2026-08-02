import axios from 'axios';

/**
 * Utility to fetch approximate IP geolocation and generate Google Maps link.
 */
export const getIpGeolocation = async (rawIp = '') => {
  // Extract clean IPv4 / IPv6
  let ip = (rawIp || '').replace(/^.*:/, '').trim();

  // Local / Private IP detection fallback
  const isLocal = !ip || ip === '127.0.0.1' || ip === '1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.');

  if (isLocal) {
    return {
      ip: ip || '127.0.0.1 (Localhost)',
      city: 'Local Workstation',
      region: 'Development Environment',
      country: 'Local Network',
      lat: 37.7749,
      lon: -122.4194,
      mapsUrl: 'https://www.google.com/maps?q=37.7749,-122.4194',
      locationString: 'Local Workstation (Development)',
      isLocal: true,
    };
  }

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,query`, {
      timeout: 3000,
    });

    if (data && data.status === 'success') {
      const city = data.city || 'Unknown City';
      const region = data.regionName || 'Unknown State';
      const country = data.country || 'Unknown Country';
      const lat = data.lat || 0;
      const lon = data.lon || 0;
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
      const locationString = `${city}, ${region}, ${country}`;

      return {
        ip: data.query || ip,
        city,
        region,
        country,
        lat,
        lon,
        mapsUrl,
        locationString,
        isLocal: false,
      };
    }
  } catch (err) {
    console.warn(`⚠️ IP Geolocation lookup notice for ${ip}:`, err.message);
  }

  // Fallback if API call fails
  return {
    ip: ip,
    city: 'Unknown City',
    region: 'Unknown Region',
    country: 'Unknown Country',
    lat: 0,
    lon: 0,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ip)}`,
    locationString: 'Location Unavailable',
    isLocal: false,
  };
};
