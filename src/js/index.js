document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const datalist = document.getElementById("cityList");
  const searchButton = document.getElementById("searchButton");
  const form = document.getElementById("weatherForm");

  lazyLoadingVideo();

  cityInput.addEventListener("input", debounce(citySuggestions, 300));

  cityInput.addEventListener("change", (e) => {
    datalist.innerHTML = "";

    searchButton.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    searchWeatherByCity();
  });
});

// ! Aplicar Lazy Loading al video de fondo
const lazyLoadingVideo = () => {
  const bgVideo = document.getElementById("bgVideo");

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      bgVideo.load();

      observer.disconnect();
    }
  });

  observer.observe(bgVideo);
};

// ! Retrasar la ejecución mientras se siga escribiendo
function debounce(func, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// ! Auto Completar la Ciudad
const citySuggestions = async () => {
  const cityInput = document.getElementById("cityInput");
  const datalist = document.getElementById("cityList");

  const initials = cityInput.value.trim();

  if (initials.length < 2) {
    datalist.innerHTML = ""; // limpiar si hay pocos caracteres

    return;
  }
  try {
    // Limpia el datalist
    datalist.innerHTML = "";

    const response = await fetch(
      `/api/autocomplete?initials=${encodeURIComponent(initials)}`
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const cities = await response.json();

    if (cities.error) {
      throw new Error(cities.error);
    }

    // Agregar opciones al datalist
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.name + ", " + city.country;
      datalist.appendChild(option);
    });
  } catch (err) {
    // console.error("Error al obtener sugerencias:", err);

    Swal.fire({
      icon: "error",
      title: "Error al obtener la lista de ciudades",
      text: err.message,
      theme: "dark",
    });
  }
};

// ! Consultar Clima por Ciudad
const searchWeatherByCity = async () => {
  const cityInput = document.getElementById("cityInput");
  const datalist = document.getElementById("cityList");

  const city = cityInput.value.trim();
  datalist.innerHTML = "";

  if (city != "") {
    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const bgVideo = document.getElementById("bgVideo");
      const videoDesktop = document.getElementById("videoDesktop");
      const videoMobile = document.getElementById("videoMobile");
      const videoAuthor = document.getElementById("videoAuthor");
      const videoLink = document.getElementById("videoLink");

      // const today = data.dateToday.split(" ")[0];
      const now = new Date();

      // Obtener fecha formateada
      const getDayAbbr = (dateStr) => {
        const dateObj = new Date(dateStr + "T12:00:00");
        return dateObj.toLocaleDateString("es-MX", { weekday: "short" });
      };

      // Obtener video
      const getVideoBackground = (descriptionStr) => {
        const d = descriptionStr.toLowerCase();

        if (
          d.includes("despejado") ||
          d.includes("soleado") ||
          d.includes("cielo claro") ||
          d.includes("parcialmente nublado") ||
          d.includes("nubes dispersas") ||
          d.includes("parcialmente soleado")
        ) {
          bgVideo.setAttribute("poster", "./media/images/Sunny Poster.webp");

          videoDesktop.setAttribute("src", "./media/videos/Sunny Video.mp4");

          videoMobile.setAttribute(
            "src",
            "./media/videos/Sunny Video Mobile.mp4"
          );

          videoLink.setAttribute(
            "href",
            "https://www.pexels.com/es-es/video/trigo-con-vista-al-atardecer-2097414/"
          );

          videoAuthor.innerText = "Madison Inouye";
        }

        if (
          d.includes("lluvia") ||
          d.includes("chubascos") ||
          d.includes("precipitaciones") ||
          d.includes("llovizna") ||
          d.includes("aguacero") ||
          d.includes("tormenta eléctrica") ||
          d.includes("tormenta") ||
          d.includes("tormenta tropical") ||
          d.includes("tormentoso") ||
          d.includes("nieve") ||
          d.includes("granizo") ||
          d.includes("tormenta de nieve") ||
          d.includes("bruma") ||
          d.includes("neblina") ||
          d.includes("niebla") ||
          d.includes("humo") ||
          d.includes("calima")
        ) {
          bgVideo.setAttribute("poster", "./media/images/Rain Poster.webp");

          videoDesktop.setAttribute("src", "./media/videos/Rain Video.mp4");

          videoMobile.setAttribute(
            "src",
            "./media/videos/Rain Video Mobile.mp4"
          );

          videoLink.setAttribute(
            "href",
            "https://www.pexels.com/es-es/video/video-de-lapso-de-tiempo-de-autos-pasando-en-un-dia-lluvioso-855222/"
          );

          videoAuthor.innerText = "Pixabay";
        }

        bgVideo.load();
        bgVideo.play().catch(() => {});
      };

      // Obtener ícono del clima
      const getWeatherIcon = (descriptionStr) => {
        const d = descriptionStr.toLowerCase();

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

        if (d.includes("nublado") || d.includes("cubierto")) return "bi-cloud";

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

      getVideoBackground(data.description);

      // ! Current Info
      document.getElementById("city").textContent = data.location;
      // document.getElementById("date").textContent = today;
      document.getElementById("date").textContent = now.toLocaleDateString();
      document.getElementById("temp").textContent = data.temperature;
      document.getElementById("weather").textContent = data.description;
      document.getElementById(
        "currentWeatherIcon"
      ).className = `bi ${getWeatherIcon(
        data.description
      )} c-forecast-weather-icon`;
      document.getElementById(
        "tempMinMax"
      ).textContent = `Min: ${data.minTempToday} - Max: ${data.maxTempToday}`;

      // ! Forecast Info
      document.getElementById("todayDate").textContent = getDayAbbr(
        data.forecastDates[0]
      );
      document.getElementById("tomorrowDate").textContent = getDayAbbr(
        data.forecastDates[1]
      );
      document.getElementById("dayAfterTomorrowDate").textContent = getDayAbbr(
        data.forecastDates[2]
      );

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

      // ! Forecast Today Info

      // Descripción
      document.getElementById("08:00Desc").textContent =
        data.hourlyForecast[0].description;
      document.getElementById("12:00Desc").textContent =
        data.hourlyForecast[1].description;
      document.getElementById("16:00Desc").textContent =
        data.hourlyForecast[2].description;
      document.getElementById("20:00Desc").textContent =
        data.hourlyForecast[3].description;
      document.getElementById("00:00Desc").textContent =
        data.hourlyForecast[4].description;

      // Icono
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

      // Temperatura Promedio
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

      // Resetear Form
      const weatherForm = document.getElementById("weatherForm");

      weatherForm.reset();
    } catch (err) {
      // console.error("Error al obtener el clima:", err);

      Swal.fire({
        icon: "error",
        title: "Error al obtener el clima",
        text: err.message,
        theme: "dark",
      });

      return;
    } finally {
      initLenis();
    }
  } else {
    document.getElementById("city").textContent = "--";
    document.getElementById("date").textContent = "--/--/----";
    document.getElementById("temp").textContent = "--° C";
    document.getElementById("weather").textContent = "--";

    initLenis();
  }
};
