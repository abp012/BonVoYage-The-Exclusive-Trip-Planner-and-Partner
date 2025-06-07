import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye, Navigation, Gauge, TrendingUp, TrendingDown } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  feelsLike: number;
  tempMax: number;
  tempMin: number;
  pressure: number;
  seaLevel: number;
  icon: string;
  forecast: {
    date: string;
    temp: number;
    description: string;
    icon: string;
  }[];
}

interface WeatherWidgetProps {
  destination: string;
  showHeader?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ destination, showHeader = true }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    if (!destination || !apiKey || apiKey === 'your_openweather_api_key_here') {
      return;
    }

    fetchWeatherData();
  }, [destination, apiKey]);
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching weather for:', destination);
      console.log('Using API key:', apiKey?.substring(0, 8) + '...');

      // Get coordinates for the destination
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${apiKey}`;
      console.log('Geocoding URL:', geocodeUrl);
      
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (!geocodeResponse.ok) {
        const errorText = await geocodeResponse.text();
        console.error('Geocoding error:', geocodeResponse.status, errorText);
        throw new Error(`Failed to geocode location: ${geocodeResponse.status} - ${errorText}`);
      }

      const geocodeData = await geocodeResponse.json();
      console.log('Geocoding data:', geocodeData);
      
      if (geocodeData.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geocodeData[0];

      // Get current weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      console.log('Weather URL:', weatherUrl);
      
      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text();
        console.error('Weather error:', weatherResponse.status, errorText);
        throw new Error(`Failed to fetch weather data: ${weatherResponse.status} - ${errorText}`);
      }

      const weatherData = await weatherResponse.json();
      console.log('Weather data:', weatherData);

      // Get 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text();
        console.error('Forecast error:', forecastResponse.status, errorText);
        throw new Error(`Failed to fetch forecast data: ${forecastResponse.status} - ${errorText}`);
      }

      const forecastData = await forecastResponse.json();
      console.log('Forecast data:', forecastData);

      // Process forecast data (get daily forecast)
      const dailyForecast = forecastData.list
        .filter((_: any, index: number) => index % 8 === 0) // Every 8th item (24 hours apart)
        .slice(0, 5)
        .map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }));      setWeather({
        location: `${geocodeData[0].name}, ${geocodeData[0].country}`,
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed, // Keep in m/s
        windDirection: weatherData.wind.deg || 0,
        visibility: Math.round(weatherData.visibility / 1000), // Convert to km
        feelsLike: Math.round(weatherData.main.feels_like),
        tempMax: Math.round(weatherData.main.temp_max),
        tempMin: Math.round(weatherData.main.temp_min),
        pressure: weatherData.main.pressure,
        seaLevel: weatherData.main.sea_level || weatherData.main.pressure,
        icon: weatherData.weather[0].icon,
        forecast: dailyForecast
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };
  const getWeatherIcon = (iconCode: string, size: string = "h-8 w-8") => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '01d': <Sun className={`${size} text-yellow-500`} />,
      '01n': <Sun className={`${size} text-blue-200`} />,
      '02d': <Cloud className={`${size} text-gray-400`} />,
      '02n': <Cloud className={`${size} text-gray-600`} />,
      '03d': <Cloud className={`${size} text-gray-500`} />,
      '03n': <Cloud className={`${size} text-gray-700`} />,
      '04d': <Cloud className={`${size} text-gray-600`} />,
      '04n': <Cloud className={`${size} text-gray-800`} />,
      '09d': <CloudRain className={`${size} text-blue-500`} />,
      '09n': <CloudRain className={`${size} text-blue-700`} />,
      '10d': <CloudRain className={`${size} text-blue-500`} />,
      '10n': <CloudRain className={`${size} text-blue-700`} />,
      '11d': <CloudRain className={`${size} text-purple-500`} />,
      '11n': <CloudRain className={`${size} text-purple-700`} />,
      '13d': <CloudSnow className={`${size} text-blue-200`} />,
      '13n': <CloudSnow className={`${size} text-blue-300`} />,
      '50d': <Cloud className={`${size} text-gray-400`} />,
      '50n': <Cloud className={`${size} text-gray-600`} />,
    };
    return iconMap[iconCode] || <Cloud className={`${size} text-gray-500`} />;
  };  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Weather Information</h2>
          </div>
        )}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Weather data requires API key</p>
              <p className="text-sm text-gray-500">
                Add your OpenWeather API key to the .env file to see weather information
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Get your free API key from{' '}
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  OpenWeatherMap
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Weather Information</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Weather Information</h2>
          </div>
        )}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <Cloud className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Unable to load weather data</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!weather) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Weather Information</h2>
          </div>
        )}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-gray-600">Enter a destination to see weather information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }  return (
    <div className="space-y-6">
      {/* Weather Section Header */}
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Weather Information</h2>
        </div>
      )}

      {/* Four-Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Main Weather Info Card (Top-left) */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Destination Name */}
              <h3 className="text-xl font-semibold text-gray-800">{weather.location}</h3>
                {/* Weather Icon and Temperature */}
              <div className="flex items-center gap-4">
                <div className="text-6xl">
                  {getWeatherIcon(weather.icon, "h-16 w-16")}
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-800">{weather.temperature}°</div>
                  <div className="text-lg text-gray-600 capitalize mt-1">{weather.description}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wind Information Card (Top-right) */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">Wind Information</h3>
            </div>
            
            <div className="space-y-4">
              {/* Wind Speed */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Wind Speed</span>
                <span className="text-2xl font-bold text-gray-800">{weather.windSpeed.toFixed(2)} m/s</span>
              </div>
              
              {/* Wind Direction */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Direction</span>
                <div className="flex items-center gap-2">
                  <Navigation 
                    className="h-5 w-5 text-green-600" 
                    style={{ transform: `rotate(${weather.windDirection}deg)` }}
                  />
                  <span className="text-2xl font-bold text-gray-800">{weather.windDirection}°</span>
                </div>
              </div>

              {/* Animated Wind Indicator */}
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <Wind className="h-12 w-12 text-green-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature and Atmospheric Details Card (Bottom-left) */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-gray-800">Temperature & Atmosphere</h3>
            </div>
            
            <div className="space-y-3">
              {/* Humidity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Humidity</span>
                </div>
                <span className="font-semibold text-gray-800">{weather.humidity}%</span>
              </div>

              {/* Max Temperature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-gray-600">Max Temperature</span>
                </div>
                <span className="font-semibold text-gray-800">{weather.tempMax}°C</span>
              </div>

              {/* Min Temperature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Min Temperature</span>
                </div>
                <span className="font-semibold text-gray-800">{weather.tempMin}°C</span>
              </div>

              {/* Feels Like */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">Feels Like</span>
                </div>
                <span className="font-semibold text-gray-800">{weather.feelsLike}°C</span>
              </div>

              {/* Sea Level Pressure */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">Sea Level Pressure</span>
                </div>
                <span className="font-semibold text-gray-800">{weather.seaLevel} hPa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibility Card (Bottom-right) */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Visibility</h3>
            </div>
            
            <div className="space-y-4">
              {/* Visibility Value */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{weather.visibility} km</div>
                <div className="text-gray-600">Current Visibility Range</div>
              </div>

              {/* Visibility Slider Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0 km</span>
                  <span>Poor</span>
                  <span>Good</span>
                  <span>10+ km</span>
                </div>
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400"></div>
                  
                  {/* Visibility indicator */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-white border-2 border-purple-600 rounded-full shadow-lg transition-all duration-500"
                    style={{ 
                      left: `${Math.min(Math.max((weather.visibility / 10) * 100, 0), 100)}%`,
                      width: '12px',
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <Badge 
                    variant={weather.visibility >= 8 ? "default" : weather.visibility >= 4 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {weather.visibility >= 8 ? "Excellent" : weather.visibility >= 4 ? "Good" : "Poor"} Visibility
                  </Badge>
                </div>
              </div>

              {/* Visibility Icon */}
              <div className="flex justify-center mt-4">
                <div className="relative">
                  <Eye className="h-10 w-10 text-purple-500" />
                  {weather.visibility >= 8 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5-Day Forecast Section */}
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium mb-2 text-gray-700">{day.date}</div>                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.icon, "h-8 w-8")}
                </div>
                <div className="text-lg font-bold text-gray-800">{day.temp}°C</div>
                <div className="text-xs text-gray-600 capitalize mt-1">{day.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherWidget;
