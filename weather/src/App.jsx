import React, { useEffect, useState } from "react";
import WeatherBackground from "./components/WeatherBackground";
import {
  convertTemperature,
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
} from "./components/Helper";
import {
  SunriseIcon,
  SunsetIcon,
  WindIcon,
  HumidityIcon,
  VisibilityIcon,
} from "./components/Icons";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

  const API_KEY = "22803c376cf17fa0b25d5bfa4479761f";

  useEffect(() => {
    if (city.trim().length > 0 && !weather) {
      const timer = setTimeout(() => fetchSuggestion(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestion = async (query) => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      res.ok ? setSuggestion(await res.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
      console.error("Failed to fetch suggestions:", error);
    }
  };

  const fetchWeatherData = async (url, name = "") => {
    setError("");
    setWeather(null);

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error((await response.json()).message || "City not found");
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim())
      return setError("Please enter a valid city or country name");
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 text-white max-w-md w-full border border-white/30 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            Weather App
          </h1>

          {!weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative">
              <input
                onChange={(e) => setCity(e.target.value)}
                value={city}
                type="text"
                placeholder="Enter city or country"
                className="mb-4 p-3 rounded border text-white bg-transparent border-white focus:outline-none"
              />
              {suggestion.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10">
                  {suggestion.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `http://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${
                            s.state ? `, ${s.state}` : ""
                          }`
                        )
                      }
                      className="block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full"
                    >
                      {s.name}, {s.country}
                      {s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="bg-purple-700 hover:blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Get Weather
              </button>
            </form>
          ) : (
            <div className="mt-6 text-center transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity("");
                }}
                className="mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
              >
                New Search
              </button>

              <div className="flex justify-between items-center">
                <h2 className="font-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                  className="bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                >
                  &deg;{unit}
                </button>
              </div>

              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />

              <p className="text-4xl">
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className="capitalize">{weather.weather[0].description}</p>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [
                    HumidityIcon,
                    "Humidity",
                    `${weather.main.humidity}% (${getHumidityValue(
                      weather.main.humidity
                    )})`,
                  ],
                  [
                    WindIcon,
                    "Wind",
                    `${weather.wind.speed} m/s ${
                      weather.wind.deg
                        ? `(${getWindDirection(weather.wind.deg)})`
                        : ""
                    }`,
                  ],
                  [
                    VisibilityIcon,
                    "Visibility",
                    getVisibilityValue(weather.visibility),
                  ],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{value}</p>
                    <p className="text-sm">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [SunriseIcon, "Sunrise", weather.sys.sunrise],
                  [SunsetIcon, "Sunset", weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">
                      {new Date(time * 1000).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm">
                <p>
                  <strong>Feels Like:</strong>{" "}
                  {convertTemperature(weather.main.feels_like, unit)} &deg;
                  {unit}
                </p>
                <p>
                  <strong>Pressure:</strong> {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
