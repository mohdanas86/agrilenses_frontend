// Location detection and geocoding utilities

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  address: string;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// Get user's current location using browser geolocation API
export function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    const options = {
      enableHighAccuracy: false, // Changed to false for better compatibility
      timeout: 15000, // Increased timeout
      maximumAge: 600000 // 10 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log(`Got coordinates: ${latitude}, ${longitude}`);
          
          // Reverse geocode to get readable address
          const locationData = await reverseGeocode(latitude, longitude);
          resolve(locationData);
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          // Return basic location data instead of rejecting
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Unknown City",
            state: "Unknown State",
            country: "Unknown Country",
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          });
        }
      },
      (error) => {
        console.error("Geolocation error details:", error);
        
        const errorMessages: { [key: number]: string } = {
          1: "Location access denied by user",
          2: "Location information unavailable", 
          3: "Location request timed out"
        };
        
        const message = errorMessages[error.code] || `Unknown location error (code: ${error.code})`;
        reject(new Error(message));
      },
      options
    );
  });
}

// Reverse geocode coordinates to get readable address
async function reverseGeocode(lat: number, lng: number): Promise<LocationData> {
  try {
    console.log(`Attempting reverse geocode for: ${lat}, ${lng}`);
    const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
    
    if (!response.ok) {
      console.error(`Geocode API returned ${response.status}: ${response.statusText}`);
      throw new Error(`Geocoding failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geocode response:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    
    // Fallback with basic coordinates
    return {
      latitude: lat,
      longitude: lng,
      city: "Unknown City",
      state: "Unknown State", 
      country: "Unknown Country",
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  }
}

// Store location in localStorage for future use
export function storeLocation(location: LocationData): void {
  try {
    localStorage.setItem('userLocation', JSON.stringify({
      ...location,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to store location:', error);
  }
}

// Get stored location from localStorage
export function getStoredLocation(): LocationData | null {
  try {
    const stored = localStorage.getItem('userLocation');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const age = Date.now() - data.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (age > maxAge) {
      localStorage.removeItem('userLocation');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get stored location:', error);
    return null;
  }
}

// Simple location detection with guaranteed fallback
export async function getLocation(): Promise<LocationData> {
  console.log("Starting location detection...");
  
  // Try stored location first (fastest)
  try {
    const stored = getStoredLocation();
    if (stored) {
      console.log("Using stored location:", stored.city);
      return stored;
    }
  } catch (error) {
    console.warn("Stored location failed:", error);
  }

  // Try browser geolocation with timeout
  try {
    console.log("Attempting browser geolocation...");
    const current = await Promise.race([
      getCurrentLocation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Geolocation timeout")), 8000)
      )
    ]);
    console.log("Browser location success:", current.city);
    storeLocation(current);
    return current;
  } catch (error) {
    console.warn("Browser geolocation failed:", error);
  }

  // Try IP-based location
  try {
    console.log("Attempting IP-based location...");
    const ipLocation = await getLocationByIP();
    console.log("IP location success:", ipLocation.city);
    storeLocation(ipLocation);
    return ipLocation;
  } catch (error) {
    console.warn("IP location failed:", error);
  }

  // Return default location (guaranteed fallback)
  const defaultLocation: LocationData = {
    latitude: 28.6139,
    longitude: 77.2090,
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    address: "New Delhi, Delhi, India"
  };
  
  console.log("Using default location:", defaultLocation.city);
  return defaultLocation;
}

// Get location using IP-based detection
async function getLocationByIP(): Promise<LocationData> {
  try {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('IP location service failed');
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'IP location error');
    }
    
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || "Unknown City",
      state: data.region || "Unknown State",
      country: data.country_name || "Unknown Country",
      address: `${data.city}, ${data.region}, ${data.country_name}`
    };
  } catch (error) {
    console.error('IP-based location detection failed:', error);
    throw error;
  }
}
