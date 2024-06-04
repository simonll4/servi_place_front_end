import { ip } from '../../../../config.js'
document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }


  //funcion para obtener los datos del usuario (nombre, apellido, imagen de perfil)
  //se obtiene el id del especialista y el contenedor donde se insertaran los datos
  function getUserData(customerId, newContainer) {
    const userUrl = `${ip}/specialist/profile/user-information/${customerId}`;
    fetch(userUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        newContainer.querySelector('#name').textContent = data.name;
        newContainer.querySelector('#lastname').textContent = data.last_name;
        if (data.profile_picture == '') {
          data.profile_picture = `../../../resources/img/anonymous-user.jpg`;
        }
        newContainer.querySelector('.profile-image img').src = data.profile_picture;
      })
      .catch(error => console.error('Error:', error));
  }


  //funcion para obtener los contenedores para cada job state
  let existingContainer = [];
  const templatePaths = ['models/pending-job.html', 'models/accepted-job.html', 'models/rejected-job.html', 'models/finished-job.html'];
  const fetchPromises = templatePaths.map((path) => {
    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const jobContainer = doc.querySelector('.jobs-container');
        existingContainer.push(jobContainer);
      });
  });

  // mapea los contenedores de los trabajos a los estados de los jobs
  const getJobContainers = () => {
    return Promise.all(fetchPromises)
      .then(() => {
        return {
          'PENDING': existingContainer[0],
          'ACCEPTED': existingContainer[1],
          'REJECTED': existingContainer[2],
          'FINISHED': existingContainer[3],
          'COMMENTED': existingContainer[3]
        };
      });
  };


  // se obtienen los trabajos del usuario y se insertan en los contenedores correspondientes
  const jobUrl = `${ip}/specialist/jobs/my-jobs`;
  fetch(jobUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {


      getJobContainers().then(jobContainers => {
        // se reccorre el objeto job devuelvo por el servidor y se les insertan los datos correspondientes
        for (const job of data.jobs) {
          const newContainer = jobContainers[job.state].cloneNode(true);

          //EVENTOS para lops botones dentro del jopbs (solo se agregan los eventos para usarlos en el futuro)
          const rejectButton = newContainer.querySelector('.btn-reject');
          if (rejectButton) {
            rejectButton.addEventListener('click', async (event) => { });
          }
          const acceptButton = newContainer.querySelector('.btn-accept');
          if (acceptButton) {
            acceptButton.addEventListener('click', async (event) => { });
          }
          const contactButton = newContainer.querySelector('#contact');
          if (contactButton) {
            contactButton.setAttribute('href', `../chat/chat.html?id=${job.idCustomer}`);
          }


          newContainer.dataset.jobId = job.id; // se guarda el id del trabajo en el contenedor como id del container-job id="data-job-id"
          getUserData(job.idCustomer, newContainer);
          newContainer.querySelector('.problem_title.row h5').textContent = job.name;
          newContainer.querySelector('.problem-description p').textContent = job.description;

          //manejo de fecha
          const date = new Date(job.createdAt);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          newContainer.querySelector('#date').textContent = date.toLocaleDateString('es-ES', options);

          const statusText = {
            'PENDING': 'Pendiente',
            'ACCEPTED': 'Aceptado',
            'REJECTED': 'Rechazado',
            'FINISHED': 'Finalizado',
            'COMMENTED': 'Comentado'
          };

          newContainer.querySelector('#job-status').textContent = statusText[job.state];
          if (job.state === 'PENDING') {
            document.querySelector('#jobs-pending').appendChild(newContainer);
          } else if (job.state === 'ACCEPTED') {
            document.querySelector('#jobs-in-progress').appendChild(newContainer);
          } else if (['REJECTED', 'FINISHED', 'COMMENTED'].includes(job.state)) {
            document.querySelector('#jobs-history').appendChild(newContainer);
          }

        }

        const jobsInProgressContainer = document.querySelector('#jobs-in-progress');
        const jobsPendingContainer = document.querySelector('#jobs-pending');
        const jobsHistoryContainer = document.querySelector('#jobs-history');
        // Verifica si hay trabajos en curso
        if (jobsInProgressContainer.children.length <= 1) {
          jobsInProgressContainer.innerHTML = `
            <h3>Trabajos en curso</h3>
            <div class="section-container text-center example">
              <p class="fw-light p-5">No hay trabajos en curso</p>
            </div>
          `;
        }

        // Verifica si hay trabajos pendientes
        if (jobsPendingContainer.children.length <= 1) {
          jobsPendingContainer.innerHTML = `
            <h3 class="mt-3">Por confirmar</h3>
            <div class="section-container text-center example">
              <p class="fw-light p-5">No hay trabajos para confirmar</p>
            </div>
          `;
        }

        // Verifica si hay trabajos en el historial
        if (jobsHistoryContainer.children.length <= 1) {
          jobsHistoryContainer.innerHTML = `
            <h3 class="mt-3 mb-2 history-title">Historial de Trabajos</h3>
            <div class="section-container text-center example">
              <p class="fw-light p-5">Los trabajos que realices aparecerán aquí</p>
            </div>
          `;
        }
      });

    })
    .catch(error => console.error('Error:', error));



  ////////////////////////////////EVENTOS//////////////////////////////////////////////////////

  // boton para cancelar trabajo, se inserta el idJob en la url
  let rejectUrl = `${ip}/specialist/jobs/reject-job/`;
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.btn-reject')) {
      const jobElement = event.target.closest('[data-job-id]');
      if (!jobElement) {
        console.error('No job container found');
        return;
      }
      const jobId = jobElement.dataset.jobId;
      rejectUrl = `${ip}/specialist/jobs/reject-job/${jobId}`;
      console.log(rejectUrl);
    }
  });

  // evento de confirmacion para cancelar trabajo
  document.getElementById('rejected_btn').addEventListener('click', async function (event) {
    try {
      const response = await fetch(rejectUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //const result = await response.json();
      location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // evento del boton para aceptar el trabajo
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.btn-accept')) {
      const jobElement = event.target.closest('[data-job-id]');
      if (!jobElement) {
        console.error('No job container found');
        return;
      }
      const jobId = jobElement.dataset.jobId;

      try {
        const response = await fetch(`${ip}/specialist/jobs/accept-job/${jobId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        location.reload();
      } catch (error) {
        console.error('An error occurred:', error);
      }

    }
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});