// Obtén los contenedores
const actionButtons = document.getElementById('action-buttons');
const editProfile = document.getElementById('edit-profile');

// Obtén el enlace "Editar Perfil"
const editProfileLink = document.querySelector('#action-buttons a[href="#edit-profile"]');

// Obtén el enlace "Volver"
const backButton = document.getElementById('back-button');

// Agrega un evento de escucha al enlace "Editar Perfil"
editProfileLink.addEventListener('click', function(event) {
  // Evita que el enlace realice su acción por defecto (navegar a "#edit-profile")
  event.preventDefault();
  
  // Oculta el contenedor "action-buttons" y muestra el contenedor "edit-profile"
  actionButtons.hidden = true;
  editProfile.hidden = false;
});

// Agrega un evento de escucha al enlace "Volver"
backButton.addEventListener('click', function(event) {
  // Evita que el enlace realice su acción por defecto (navegar a "#")
  event.preventDefault();
  // Muestra el contenedor "action-buttons" y oculta el contenedor "edit-profile"
  actionButtons.hidden = false;
  editProfile.hidden = true;
});