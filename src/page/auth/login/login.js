import { showToast } from "../../../components/toast/toast.js";
// if (!document.querySelector('.toast-container')) {
//   console.log("fasfasf")
//   const toastContainer = document.createElement('div');
//   toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
//   toastContainer.style.zIndex = '1050';
//   document.body.appendChild(toastContainer);
// }

// function showErrorToast(message) {
//   // Crear el elemento del toast
//   const toastEl = document.createElement('div');
//   toastEl.className = 'toast align-items-center text-bg-danger border-0';
//   toastEl.role = 'alert';
//   toastEl.ariaLive = 'assertive';
//   toastEl.ariaAtomic = 'true';

//   toastEl.innerHTML = `
//     <div class="d-flex">
//         <div class="toast-body">
//             ${message}
//         </div>
//         <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//     </div>
//   `;

//   // Añadir el toast al contenedor
//   document.querySelector('.toast-container').appendChild(toastEl);

//   // Mostrar el toast
//   const toast = new bootstrap.Toast(toastEl);
//   toast.show();

//   // Eliminar el toast del DOM cuando se oculta
//   toastEl.addEventListener('hidden.bs.toast', () => {
//     toastEl.remove();
//   });
// }

document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.querySelector('.my-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    document.querySelector('#loading').style.cssText = 'display: block !important;';

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
        throw new Error('Error: credenciales inválidas!');
      }
      return response.json();
    }).then(data => {
      localStorage.setItem('role', data.role);
      localStorage.setItem('id', data.id);

      document.querySelector('#loading').style.cssText = 'display: none !important;';
      if (data.role === 'SPECIALIST') {
        window.location.href = '../../specialist/dashboard/dashboard_specialist.html';
      } else if (data.role === 'CUSTOMER') {
        window.location.href = '../../customer/dashboard/explore_posts.html';
      }
    }).catch(error => {
      document.querySelector('#loading').style.cssText = 'display: none !important;';
      showToast("¡Credenciales inválidas!")
      console.error('Error:', error);
    })
  });
});

