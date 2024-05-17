document.addEventListener('DOMContentLoaded', (event) => {


  const form = document.querySelector('.my-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Crea un objeto FormData a partir del formulario y lo pasa a json
    const formData = new FormData(form);
    const jsonObject = {};
    for (const [key, value] of formData.entries()) {
      jsonObject[key] = value;
    }
    const jsonString = JSON.stringify(jsonObject);

    // Envía la cadena JSON al servidor
    fetch('http://localhost:5016/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString
    }).then(response => {

      // Guarda el token en localStorage
      const authHeader = response.headers.get('Authorization');

      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        localStorage.setItem('token', token);
        console.log(localStorage.getItem('token'));
      } else {
        console.error('No Authorization header in response');
      }
      return response.json();
    }).then(data => {
      // Imprime el mensaje en la consola
      console.log(data.message);
    }).catch(error => {
      console.error('Error:', error);
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});