require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

const API_KEY = process.env.API_KEY_WEATHERSTACK;
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "Ciudad no proporcionada" });

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get("http://api.weatherapi.com/v1/current.json", {
        params: { key: API_KEY, q: city, lang: "es" },
      }),

      axios.get("http://api.weatherapi.com/v1/forecast.json", {
        params: { key: API_KEY, q: city, days: 3, lang: "es" },
      }),
    ]);

    const currentData = currentRes.data;
    const forecastData = forecastRes.data;

    if (!currentData.location || !currentData.current) {
      return res.status(404).json({ error: "Ciudad no encontrada (current)" });
    }

    if (!forecastData.forecast) {
      return res.status(404).json({ error: "Ciudad no encontrada (forecast)" });
    }

    const avgTemps = forecastData.forecast.forecastday.map((day) => ({
      date: day.date,
      avgTemp: `${day.day.avgtemp_c}° C`,
      maxTemp: `${day.day.maxtemp_c}° C`,
      minTemp: `${day.day.mintemp_c}° C`,
      description: day.day.condition.text,
    }));

    const todayForecast = forecastData.forecast.forecastday[0].day;

    const forecastDates = forecastData.forecast.forecastday.map(
      (day) => day.date
    );

    const todayHours = forecastData.forecast.forecastday[0].hour;

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

    res.json({
      location: `${currentData.location.name}, ${currentData.location.country}`,
      dateToday: `${currentData.location.localtime}`,
      temperature: `${currentData.current.temp_c}° C`,
      description: currentData.current.condition.text,
      maxTempToday: `${todayForecast.maxtemp_c}° C`,
      minTempToday: `${todayForecast.mintemp_c}° C`,
      forecastDates: forecastDates,
      forecast: avgTemps,
      hourlyForecast: hourlyForecast,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando clima" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
