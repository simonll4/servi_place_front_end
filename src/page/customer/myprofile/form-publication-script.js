document.addEventListener("DOMContentLoaded", function () {
  // Obtén el textarea, el select, el input de tipo file y el botón de envío
  const textarea = document.querySelector("#publication-form textarea");
  const select = document.querySelector("#publication-form select");
  const fileInput = document.querySelector(
    "#publication-form input[type='file']"
  );
  const submitButton = document.getElementById("submit-publication-button");

  // Función para verificar si se debe habilitar el botón de envío
  function checkInputs() {
    // Verifica si se ha seleccionado una opción, si se ha ingresado texto en el textarea y si se ha seleccionado un archivo
    const hasInput =
      select.value !== "Selecciona una opcion" &&
      textarea.value.trim() !== "" &&
      fileInput.files.length > 0;

    // Habilita o deshabilita el botón de envío según si hay texto, una opción seleccionada y un archivo seleccionado o no
    submitButton.disabled = !hasInput;
  }

  // Agrega un evento de escucha al textarea, al select y al input de tipo file
  textarea.addEventListener("input", checkInputs);
  select.addEventListener("change", checkInputs);
  fileInput.addEventListener("change", checkInputs);
});
