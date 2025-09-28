import { NextRequest, NextResponse } from 'next/server';

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
        is_moon_up: number;
        is_sun_up: number;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        vis_miles: number;
        gust_mph: number;
        gust_kph: number;
        uv: number;
      }>;
    }>;
  };
}

interface ProcessedForecastItem {
  date: string;
  time: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  clouds: number;
  visibility: number;
  precipitationProbability: number;
  isDay: boolean;
}

interface ProcessedForecastData {
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
    timezone: number;
    sunrise: number;
    sunset: number;
  };
  forecast: ProcessedForecastItem[];
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    // Use WeatherAPI for forecast (since the key is already configured)
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;

    const response = await fetch(url, {
      method: 'GET',
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data: WeatherAPIResponse = await response.json();

    // Validate response structure
    if (!data.forecast || !data.forecast.forecastday || data.forecast.forecastday.length === 0) {
      throw new Error('Invalid forecast data received');
    }

    // Process and clean the forecast data
    const processedForecast: ProcessedForecastItem[] = [];

    // Process each forecast day and its hours
    data.forecast.forecastday.forEach((day) => {
      day.hour.forEach((hour) => {
        const dateTime = new Date(hour.time);
        const date = dateTime.toISOString().split('T')[0];
        const time = dateTime.toTimeString().split(' ')[0].substring(0, 5);

        processedForecast.push({
          date,
          time,
          temperature: Math.round(hour.temp_c),
          feelsLike: Math.round(hour.feelslike_c),
          tempMin: Math.round(hour.temp_c), // WeatherAPI doesn't provide min/max per hour
          tempMax: Math.round(hour.temp_c),
          humidity: hour.humidity,
          pressure: Math.round(hour.pressure_mb),
          windSpeed: Math.round(hour.wind_kph),
          windDirection: hour.wind_degree,
          windGust: hour.gust_kph ? Math.round(hour.gust_kph) : undefined,
          weather: {
            main: hour.condition.text,
            description: hour.condition.text,
            icon: hour.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', '').replace('.png', ''),
          },
          clouds: hour.cloud,
          visibility: Math.round(hour.vis_km),
          precipitationProbability: hour.chance_of_rain,
          isDay: hour.is_day === 1
        });
      });
    });

    // Process location data with fallbacks
    const processedData: ProcessedForecastData = {
      location: {
        name: data.location?.name || city || 'Unknown Location',
        country: data.location?.country || 'IN',
        coordinates: {
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        },
        timezone: 19800, // Default to IST (WeatherAPI doesn't provide timezone offset)
        sunrise: Date.now() / 1000, // WeatherAPI doesn't provide sunrise/sunset in forecast
        sunset: (Date.now() / 1000) + 43200
      },
      forecast: processedForecast,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Weather forecast API error:', error);

    // Return a more user-friendly error response
    return NextResponse.json(
      {
        error: 'Failed to fetch weather forecast',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}