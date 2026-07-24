export interface LiveWeatherData {
  locationName: string;
  temperature: number;
  weatherCondition: string;
  humidity: number;
  rainChance: number;
  latitude: number;
  longitude: number;
}

const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  80: 'Slight Showers',
  81: 'Moderate Showers',
  82: 'Violent Showers',
  95: 'Thunderstorm',
};

let cachedWeatherData: LiveWeatherData | null = null;

export async function fetchLiveWeather(): Promise<LiveWeatherData> {
  if (cachedWeatherData) {
    return cachedWeatherData;
  }

  let lat = 12.9716;
  let lon = 77.5946;
  let locationName = 'Detecting location...';

  try {
    // 1. IP-based instant Location Lookup (Requires NO GPS permission popups!)
    const ipRes = await fetch('https://ipapi.co/json/').catch(() => null);
    if (ipRes && ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.city || ipData.region) {
        cityFormat:
        locationName = `${ipData.city || ipData.region}${ipData.region ? `, ${ipData.region}` : ''}`;
        lat = ipData.latitude || lat;
        lon = ipData.longitude || lon;
      }
    } else {
      // Secondary fallback IP Geolocation API
      const altRes = await fetch('http://ip-api.com/json/').catch(() => null);
      if (altRes && altRes.ok) {
        const altData = await altRes.json();
        if (altData.city) {
          locationName = `${altData.city}, ${altData.regionName || altData.country}`;
          lat = altData.lat || lat;
          lon = altData.lon || lon;
        }
      }
    }

    // 2. Fetch Real Weather Telemetry from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability`
    );
    const weatherData = await weatherRes.json();

    const currentWeather = weatherData.current_weather;
    const conditionCode = currentWeather?.weathercode ?? 0;
    const weatherCondition = WMO_CODE_MAP[conditionCode] || 'Partly Cloudy';
    const humidity = weatherData.hourly?.relative_humidity_2m?.[0] || 65;
    const rainChance = weatherData.hourly?.precipitation_probability?.[0] || 10;

    const result: LiveWeatherData = {
      locationName: locationName !== 'Detecting location...' ? locationName : 'Bengaluru, India',
      temperature: Math.round(currentWeather?.temperature ?? 28),
      weatherCondition,
      humidity,
      rainChance,
      latitude: lat,
      longitude: lon,
    };

    cachedWeatherData = result;
    return result;
  } catch (err) {
    console.warn('Weather fetch warning:', err);
    return {
      locationName: 'Bengaluru, India',
      temperature: 28,
      weatherCondition: 'Partly Cloudy',
      humidity: 62,
      rainChance: 15,
      latitude: lat,
      longitude: lon,
    };
  }
}
