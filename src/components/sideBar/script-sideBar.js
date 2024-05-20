const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  const href = new URL(elem.href);

  // Comprueba si la ruta del enlace coincide con la ruta actual
  if (href.pathname === window.location.pathname) {
    // Si la ruta del enlace coincide con la ruta actual, agrega la clase "active"
    elem.classList.add("active");
  } else {
    // Si no coincide, remueve la clase "active"
    elem.classList.remove("active");
  }
});
