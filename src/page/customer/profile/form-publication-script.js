document.addEventListener("DOMContentLoaded", function () {
  // Obtén el textarea, el select y el botón de envío
  const textarea = document.querySelector("#publication-form textarea");
  const select = document.querySelector("#publication-form select");
  const submitButton = document.getElementById("submit-publication-button");

  // Función para verificar si se debe habilitar el botón de envío
  function checkInputs() {
    // Verifica si se ha seleccionado una opción y si se ha ingresado texto en el textarea
    const hasInput =
      select.value !== "Selecciona una opcion" && textarea.value.trim() !== "";

    // Habilita o deshabilita el botón de envío según si hay texto y una opción seleccionada o no
    submitButton.disabled = !hasInput;
  }

  // Agrega un evento de escucha al textarea y al select
  textarea.addEventListener("input", checkInputs);
  select.addEventListener("change", checkInputs);
});
