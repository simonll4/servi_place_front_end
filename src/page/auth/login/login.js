document.addEventListener('DOMContentLoaded', (event) => {


  const form = document.querySelector('.my-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    document.getElementById('loading').style.display = 'block';

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

      localStorage.setItem('role', data.role);
      localStorage.setItem('id', data.id);

      if (data.role === 'SPECIALIST') {
        window.location.href = '../../specialist/dashboard/dashboard_specialist.html';
      } else if (data.role === 'CUSTOMER') {
        window.location.href = '../../customer/dashboard/explore_posts.html';
      }

    }).catch(error => {
      console.error('Error:', error);
    });

    document.getElementById('loading').style.display = 'none';
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});