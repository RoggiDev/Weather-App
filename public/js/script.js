const searchWeatherByCity = () => {
  const city = document.getElementById("cityInput").value;

  if (city != "") {
    // Realiza una petición HTTP GET enviando la ciudad
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      // Convierte la respuesta a JSON
      .then((res) => res.json())
      // Obtiene los datos recibidos
      .then((data) => {
        // Si hubo un error se muestra el mensaje en un alert
        if (data.error) {
          alert(data.error);
          return;
        }

        const today = data.dateToday.split(" ")[0];

        const getDayAbbr = (dateStr) => {
          const dateObj = new Date(dateStr);
          return dateObj.toLocaleDateString("es-MX", { weekday: "short" });
        };

        const getWeatherIcon = (descriptionStr) => {
          d = descriptionStr.toLowerCase();

          if (
            d.includes("despejado") ||
            d.includes("soleado") ||
            d.includes("cielo claro")
          )
            return "bi-sun";

          if (
            d.includes("parcialmente nublado") ||
            d.includes("nubes dispersas") ||
            d.includes("parcialmente soleado")
          )
            return "bi-cloud-sun";

          if (d.includes("nublado") || d.includes("cubierto"))
            return "bi-cloud";

          if (
            d.includes("lluvia") ||
            d.includes("chubascos") ||
            d.includes("precipitaciones") ||
            d.includes("llovizna") ||
            d.includes("aguacero")
          )
            return "bi-cloud-rain";

          if (
            d.includes("tormenta eléctrica") ||
            d.includes("tormenta") ||
            d.includes("tormenta tropical") ||
            d.includes("tormentoso")
          )
            return "bi-cloud-lightning";

          if (
            d.includes("nieve") ||
            d.includes("granizo") ||
            d.includes("tormenta de nieve")
          )
            return "bi-snow";

          if (
            d.includes("bruma") ||
            d.includes("neblina") ||
            d.includes("niebla") ||
            d.includes("humo") ||
            d.includes("calima")
          )
            return "bi-cloud-fog";

          if (d.includes("ventoso") || d.includes("viento")) return "bi-wind";
        };

        // Current Info
        document.getElementById("city").textContent = data.location;
        document.getElementById("date").textContent = today;
        document.getElementById("temp").textContent = data.temperature;
        document.getElementById("weather").textContent = data.description;
        document.getElementById(
          "tempMinMax"
        ).textContent = `Min: ${data.minTempToday} - Max: ${data.maxTempToday}`;

        // Forecast Info
        document.getElementById("todayDate").textContent = getDayAbbr(
          data.forecastDates[0]
        );
        document.getElementById("tomorrowDate").textContent = getDayAbbr(
          data.forecastDates[1]
        );
        document.getElementById("dayAfterTomorrowDate").textContent =
          getDayAbbr(data.forecastDates[2]);

        document.getElementById("todayMapTemp").textContent =
          data.forecast[0].avgTemp;
        document.getElementById("tomorroMapTemp").textContent =
          data.forecast[1].avgTemp;
        document.getElementById("dayAfterTomorrowMapTemp").textContent =
          data.forecast[2].avgTemp;

        document.getElementById(
          "todayWeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.forecast[0].description
        )} c-forecast-weather-icon`;
        document.getElementById(
          "tomorrowWeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.forecast[1].description
        )} c-forecast-weather-icon`;
        document.getElementById(
          "dayAfterTomorrowWeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.forecast[2].description
        )} c-forecast-weather-icon`;

        /* document.getElementById("todayMapTemp").textContent =
          data.forecast[0].description; */

        // Forecast Today Info
        document.getElementById("08:00Temp").textContent =
          data.hourlyForecast[0].temp;
        document.getElementById("12:00Temp").textContent =
          data.hourlyForecast[1].temp;
        document.getElementById("16:00Temp").textContent =
          data.hourlyForecast[2].temp;
        document.getElementById("20:00Temp").textContent =
          data.hourlyForecast[3].temp;
        document.getElementById("00:00Temp").textContent =
          data.hourlyForecast[4].temp;

        document.getElementById(
          "08:00WeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.hourlyForecast[0].description
        )} c-today-weather`;
        document.getElementById(
          "12:00WeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.hourlyForecast[1].description
        )} c-today-weather`;
        document.getElementById(
          "16:00WeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.hourlyForecast[2].description
        )} c-today-weather`;

        /* document.getElementById("16:00WeatherIcon").textContent =
          data.hourlyForecast[2].description; */

        document.getElementById(
          "20:00WeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.hourlyForecast[3].description
        )} c-today-weather`;
        document.getElementById(
          "00:00WeatherIcon"
        ).className = `bi ${getWeatherIcon(
          data.hourlyForecast[4].description
        )} c-today-weather`;
      })
      .catch((err) => {
        console.error("Error al obtener el clima:", err);
      });
  } else {
    document.getElementById("city").textContent = "-";
    document.getElementById("temp").textContent = "-";
    document.getElementById("weather").textContent = "-";
  }
};
