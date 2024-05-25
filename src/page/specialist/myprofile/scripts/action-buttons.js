document.addEventListener("DOMContentLoaded", (event) => {
  // Obtén los botones y los contenedores
  const editProfileButton = document.getElementById("edit-profile-button");
  const backButton = document.getElementById("back-button");
  const editProfile = document.getElementById("edit-profile");
  const myProfile = document.getElementById("my-profile-section");

  // Agrega un evento de escucha al botón "edit-profile-button"
  editProfileButton.addEventListener("click", function () {
    // Muestra el contenedor "edit-profile" y oculta el contenedor "my-profile"
    
    myProfile.hidden = true;
    editProfile.hidden = false;
  });

  // Agrega un evento de escucha al botón "back-button"
  backButton.addEventListener("click", function (event) {
    // Evita que el enlace realice su acción por defecto (navegar a "#")
    event.preventDefault();

    // Oculta el contenedor "edit-profile" y muestra el contenedor "my-profile"
    editProfile.hidden = true;
    myProfile.hidden = false;
  });
});
