window.onload = async function () {
  const responseNavBar = await fetch("../navBar/navbar.html");
  const dataNavBar = await responseNavBar.text();
  document.querySelector("#header-container").innerHTML = dataNavBar;

  const responseSideBar = await fetch("../sideBar/sidebar.html");
  const dataSideBar = await responseSideBar.text();
  document.querySelector("#sidebar-container").innerHTML = dataSideBar;

  const responseFooter = await fetch("../footer/footer.html");
  const dataFooter = await responseSideBar.text();
  document.querySelector("#footer").innerHTML = dataSideBar;

  // Cargar los scripts después de que el contenido se haya insertado
  const scriptSideBar = document.createElement("script");
  scriptSideBar.src = "../sideBar/script-sideBar.js";
  document.body.appendChild(scriptSideBar);

  const scriptNavBar = document.createElement("script");
  scriptNavBar.src = "../navBar/script-navBar.js";
  document.body.appendChild(scriptNavBar);
};
