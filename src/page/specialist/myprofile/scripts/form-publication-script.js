document.addEventListener("DOMContentLoaded", function () {
  // Obtén el textarea y el botón de envío
  const textarea = document.querySelector("#publication-form textarea");
  const submitButton = document.getElementById("submit-publication-button");

  // Función para verificar si se debe habilitar el botón de envío
  function checkInputs() {
    // Verifica si se ha ingresado texto en el textarea
    const hasInput = textarea.value.trim() !== "";

    // Habilita o deshabilita el botón de envío según si hay texto o no
    submitButton.disabled = !hasInput;
  }

  // Agrega un evento de escucha al textarea
  textarea.addEventListener("input", checkInputs);
});
