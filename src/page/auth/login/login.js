import { showToast } from "../../../components/toast/toast.js";
import {ip} from '../../../config.js'

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
    fetch(`${ip}/auth/login`, {
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
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();

    }).then(data => {

      //Esto no se ve, es muy rapido...
      showToast("¡Login exitoso!", true);

      localStorage.setItem('role', data.role);
      localStorage.setItem('id', data.id);

      if (data.role === 'SPECIALIST') {
        window.location.href = '../../specialist/dashboard/dashboard_specialist.html';
      } else if (data.role === 'CUSTOMER') {
        window.location.href = '../../customer/dashboard/explore_posts.html';
      }

    }).catch((error) => {
      console.log(error)
      const statusCode = error.message.split(' ')[1]; // Extract the status code from the error message
      if (statusCode === '401') {
        showToast("¡Credenciales invalidas!", false);
      } else {
        showToast("El servidor no respondio", false);
      }
    });

    document.getElementById('loading').style.cssText = 'display: none !important;';
  });
});