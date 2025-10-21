const setTheme = () => {
  let darkmode = localStorage.getItem("darkmode");

  if (darkmode === "active") {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
};

const changeTheme = () => {
  let darkmode = localStorage.getItem("darkmode");

  darkmode !== "active" ? enableDarkmode() : disableDarkmode();
};

const enableDarkmode = () => {
  const lightMode = document.getElementById("lightMode");
  const darktMode = document.getElementById("darktMode");

  lightMode.classList.remove("d-none");
  lightMode.classList.add("d-block");

  darktMode.classList.remove("d-block");
  darktMode.classList.add("d-none");

  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disableDarkmode = () => {
  const lightMode = document.getElementById("lightMode");
  const darktMode = document.getElementById("darktMode");

  lightMode.classList.remove("d-block");
  lightMode.classList.add("d-none");

  darktMode.classList.remove("d-none");
  darktMode.classList.add("d-block");

  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};
