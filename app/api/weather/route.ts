import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const city = searchParams.get('city');
    
    const weatherApiKey = process.env.WEATHER_API_KEY;
    if (!weatherApiKey) {
      return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 });
    }

    let query = '';
    
    // Use coordinates if provided (more accurate)
    if (lat && lng) {
      query = `${lat},${lng}`;
    } else if (city) {
      query = city;
    } else {
      query = 'London'; // Default fallback
    }

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${query}&aqi=yes`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    
    // Enhanced weather response with more details
    const weatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        localtime: data.location.localtime
      },
      current: {
        temperature: data.current.temp_c,
        temperatureF: data.current.temp_f,
        condition: data.current.condition.text,
        conditionIcon: data.current.condition.icon,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        windDirection: data.current.wind_dir,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        uvIndex: data.current.uv,
        feelsLike: data.current.feelslike_c,
        airQuality: data.current.air_quality ? {
          co: data.current.air_quality.co,
          no2: data.current.air_quality.no2,
          o3: data.current.air_quality.o3,
          so2: data.current.air_quality.so2,
          pm2_5: data.current.air_quality.pm2_5,
          pm10: data.current.air_quality.pm10,
          usEpaIndex: data.current.air_quality["us-epa-index"],
          gbDefraIndex: data.current.air_quality["gb-defra-index"]
        } : null
      },
      farming: {
        // Add farming-specific advice based on weather
        irrigation: getIrrigationAdvice(data.current),
        fieldWork: getFieldWorkAdvice(data.current),
        pestRisk: getPestRiskAssessment(data.current),
        generalAdvice: getGeneralFarmingAdvice(data.current)
      }
    };

    return NextResponse.json(weatherData);

  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

// Helper functions for farming advice
function getIrrigationAdvice(weather: any): string {
  const humidity = weather.humidity;
  const temp = weather.temp_c;
  
  if (humidity < 30 && temp > 30) {
    return "High irrigation needed due to low humidity and high temperature.";
  } else if (humidity < 50 && temp > 25) {
    return "Moderate irrigation recommended.";
  } else if (humidity > 80) {
    return "Reduce irrigation to prevent waterlogging and fungal diseases.";
  }
  return "Normal irrigation schedule should be sufficient.";
}

function getFieldWorkAdvice(weather: any): string {
  const windSpeed = weather.wind_kph;
  const humidity = weather.humidity;
  const condition = weather.condition.text.toLowerCase();
  
  if (condition.includes('rain') || condition.includes('storm')) {
    return "Avoid field work. Wait for weather to clear.";
  } else if (windSpeed > 25) {
    return "High winds - avoid spraying and be cautious with light equipment.";
  } else if (humidity < 40 && windSpeed > 15) {
    return "Good conditions for spraying, but be mindful of drift.";
  }
  return "Good conditions for field work.";
}

function getPestRiskAssessment(weather: any): string {
  const temp = weather.temp_c;
  const humidity = weather.humidity;
  
  if (temp > 25 && humidity > 70) {
    return "High pest and disease risk. Monitor crops closely.";
  } else if (temp > 20 && humidity > 60) {
    return "Moderate pest risk. Regular monitoring recommended.";
  }
  return "Low pest risk under current conditions.";
}

function getGeneralFarmingAdvice(weather: any): string {
  const temp = weather.temp_c;
  const uv = weather.uv;
  const condition = weather.condition.text.toLowerCase();
  
  if (temp > 35) {
    return "Extreme heat - ensure livestock have shade and water. Avoid midday field work.";
  } else if (temp < 5) {
    return "Cold conditions - protect sensitive crops and ensure livestock warmth.";
  } else if (uv > 7) {
    return "High UV levels - wear protection and consider crop shading if needed.";
  } else if (condition.includes('clear') && temp > 20 && temp < 30) {
    return "Excellent farming conditions. Good day for most agricultural activities.";
  }
  return "Monitor weather regularly and adjust farming activities accordingly.";
}
