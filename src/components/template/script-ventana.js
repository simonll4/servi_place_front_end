window.addEventListener("scroll", function () {
  var sidebar = document.getElementById("sidebar-container");
  var footer = document.getElementById("footer");
  var sidebarRect = sidebar.getBoundingClientRect();
  var footerRect = footer.getBoundingClientRect();

  if (sidebarRect.bottom >= footerRect.top) {
    sidebar.style.position = "static";
  } else {
    sidebar.style.position = "flex";
  }
});
