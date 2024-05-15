document.addEventListener("DOMContentLoaded", function () {
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("password-confirm");
    var submitButton = document.querySelector('button[type="submit"]'); // Asegúrate de tener un botón de envío en tu formulario
  
    function validatePasswords() {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Las contraseñas no coinciden");
        submitButton.disabled = true;
      } else {
        confirmPassword.setCustomValidity("");
        submitButton.disabled = false;
      }
    }
  
    password.addEventListener("input", validatePasswords);
    confirmPassword.addEventListener("input", validatePasswords);

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
});