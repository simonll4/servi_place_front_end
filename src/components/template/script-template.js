window.onload = async function () {
  const responseNavBar = await fetch("/src/components/navBar/navBar.html");
  const dataNavBar = await responseNavBar.text();
  document.querySelector("#header-container").innerHTML = dataNavBar;

  const responseSideBar = await fetch("/src/components/sideBar/sideBar.html");
  const dataSideBar = await responseSideBar.text();
  document.querySelector("#sidebar-container").innerHTML = dataSideBar;

  const responseFooter = await fetch("/src/components/footer/footer.html");
  const dataFooter = await responseFooter.text();
  document.querySelector("#footer").innerHTML = dataFooter;

  // Cargar los scripts después de que el contenido se haya insertado
  const scriptSideBar = document.createElement("script");
  scriptSideBar.src = "/src/components/sideBar/script-sideBar.js";
  document.body.appendChild(scriptSideBar);

  const scriptNavBar = document.createElement("script");
  scriptNavBar.src = "/src/components/navBar/script-navBar.js";
  document.body.appendChild(scriptNavBar);
};
