require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

const API_KEY_GEOAPIFY = process.env.API_KEY_GEOAPIFY;
const API_KEY_WEATHERAPI = process.env.API_KEY_WEATHERAPI;
const PORT = process.env.PORT || 3000;

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "src")));

// ! Ruta API que devuelve una lista de 20 ciudades
app.get("/api/autocomplete", async (req, res) => {
  const initials = req.query.initials?.trim();

  if (!initials) {
    return res.status(400).json({ error: "Iniciales no proporcionadas" });
  }

  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/autocomplete",
      {
        params: {
          text: initials,
          apiKey: API_KEY_GEOAPIFY,
          limit: 20,
          type: "city",
          lang: "en",
        },
      }
    );

    const features = response.data.features;

    if (!features) {
      return res.status(500).json({ error: "Geoapify no devolvió resultados" });
    }

    const cities = features
      .filter((r) => r.properties?.city)
      .map((r) => ({
        name: r.properties.city,
        country: r.properties.country,
      }));

    res.json(cities);
  } catch (error) {
    console.error("Error al obtener sugerencias:", error.message);

    res.status(500).json({ error: "Error al obtener sugerencias" });
  }
});

// ! Ruta API que devuelve el clima de una ciudad
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) return res.status(400).json({ error: "Ciudad no proporcionada" });

  try {
    // Realiza la solicitud a la API de WeatherAPI
    const response = await axios.get(
      "http://api.weatherapi.com/v1/forecast.json",
      {
        params: {
          key: API_KEY_WEATHERAPI,
          q: city,
          days: 3,
          lang: "es",
        },
      }
    );

    const { location, current, forecast } = response.data;

    // Validaciones
    if (!location || !current) {
      return res.status(404).json({ error: "Ciudad no encontrada (current)" });
    }

    if (!forecast?.forecastday) {
      return res.status(404).json({ error: "Ciudad no encontrada (forecast)" });
    }

    const avgTemps = forecast.forecastday.map((day) => ({
      date: day.date,
      avgTemp: `${day.day.avgtemp_c}° C`,
      maxTemp: `${day.day.maxtemp_c}° C`,
      minTemp: `${day.day.mintemp_c}° C`,
      description: day.day.condition.text,
    }));

    const todayForecast = forecast.forecastday[0].day;

    const forecastDates = forecast.forecastday.map((day) => day.date);

    const todayHours = forecast.forecastday[0].hour;

    const horasDeseadas = ["08:00", "12:00", "16:00", "20:00", "00:00"];

    const hourlyForecast = horasDeseadas.map((hora) => {
      const horaMatch = todayHours.find((h) => h.time.endsWith(hora));

      return horaMatch
        ? {
            temp: `${horaMatch.temp_c}° C`,
            description: horaMatch.condition.text,
          }
        : {
            temp: "-- ° C",
            description: "--",
          };
    });

    // Retorna la respuesta en formato JSON
    res.json({
      // ! Current Info
      location: `${location.name}, ${location.country}`,
      // dateToday: `${location.localtime}`,
      temperature: `${current.temp_c}° C`,
      description: current.condition.text,
      maxTempToday: `${todayForecast.maxtemp_c}° C`,
      minTempToday: `${todayForecast.mintemp_c}° C`,
      // ! Forecast Info
      forecastDates: forecastDates,
      forecast: avgTemps,
      // ! Forecast Today Info
      hourlyForecast: hourlyForecast,
    });
  } catch (err) {
    // console.error(err);

    res.status(500).json({ error: "Error consultando clima" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
