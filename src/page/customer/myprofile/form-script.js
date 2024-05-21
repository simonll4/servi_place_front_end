document.addEventListener('DOMContentLoaded', function() {
  // Obtén todos los campos de entrada y el botón de envío
  const inputs = document.querySelectorAll('#basic-info-form input');
  const submitButton = document.getElementById('submit-button');

  // Agrega un evento de escucha a cada campo de entrada
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      // Verifica si alguno de los campos de entrada tiene texto
      const hasInput = Array.from(inputs).some(input => input.value.trim() !== '');

      // Habilita o deshabilita el botón de envío según si hay texto o no
      submitButton.disabled = !hasInput;
    });
  });
});