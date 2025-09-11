import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Missing latitude or longitude" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEO_API_URL; // Google Geocoding API key
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Geocoding API key not configured" },
        { status: 500 }
      );
    }

    // Use Google Geocoding API for reverse geocoding
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error('No geocoding results found');
    }

    const result = data.results[0];
    const components = result.address_components;

    // Extract location components
    let city = '';
    let state = '';
    let country = '';

    for (const component of components) {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
    }

    // Fallback for city name
    if (!city) {
      for (const component of components) {
        if (component.types.includes('sublocality') || 
            component.types.includes('neighborhood') ||
            component.types.includes('administrative_area_level_3')) {
          city = component.long_name;
          break;
        }
      }
    }

    const locationData = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      city: city || 'Unknown City',
      state: state || 'Unknown State',
      country: country || 'Unknown Country',
      address: result.formatted_address
    };

    return NextResponse.json(locationData);

  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json(
      { error: "Failed to get location details" },
      { status: 500 }
    );
  }
}
