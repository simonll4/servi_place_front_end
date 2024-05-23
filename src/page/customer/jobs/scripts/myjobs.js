document.addEventListener("DOMContentLoaded", function () {

  //token (esto se deberia obtener del localStorage)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE2NDIxMTYxLCJleHAiOjE3MTY1MDc1NjF9.ma15hbXlBwC-ImUquWhJm9XEjRvkATPFAe72MJ7nAKU'

  function getUserData(specialistId, newContainer) {
    const userUrl = `http://127.0.0.1:5016/customer/profile/user-information/${specialistId}`;
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
        newContainer.querySelector('.profile-image img').src = data.profile_picture;
      })
      .catch(error => console.error('Error:', error));
  }


  const existingContainer = [];
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

  let jobContainers;
  const getJobContainers = () => {
    return Promise.all(fetchPromises)
      .then(() => {
        return {
          'PENDING': existingContainer[0],
          'ACCEPTED': existingContainer[1],
          'REJECTED': existingContainer[2],
          'FINISHED': existingContainer[3]
        };
      });
  };



  const jobUrl = 'http://127.0.0.1:5016/customer/jobs/my-jobs';
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
        for (const job of data.jobs) {
          const newContainer = jobContainers[job.state].cloneNode(true);

          newContainer.dataset.jobId = job.id; // Guardar el ID del trabajo en el contenedor

          getUserData(job.idSpecialist, newContainer);
          newContainer.querySelector('.problem_title h5').textContent = job.title;
          newContainer.querySelector('.problem-description p').textContent = job.description;

          // se agrega evento a al boton de cancelar el trabajo, si es que existe
          const rejectButton = newContainer.querySelector('.btn-reject');
          if (rejectButton) {
            rejectButton.addEventListener('click', async (event) => { });
          }

          const statusText = {
            'PENDING': 'Pendiente',
            'ACCEPTED': 'Aceptado',
            'REJECTED': 'Rechazado',
            'FINISHED': 'Finalizado'
          };

          newContainer.querySelector('#job-status').textContent = statusText[job.state];

          if (['PENDING', 'ACCEPTED'].includes(job.state)) {
            document.querySelector('.jobs-in-progress').appendChild(newContainer);
          } else if (['REJECTED', 'FINISHED'].includes(job.state)) {
            document.querySelector('#jobs-history').appendChild(newContainer);
          }
        }
      });
    })
    .catch(error => console.error('Error:', error));

  document.addEventListener('click', async (event) => {
    if (event.target.matches('.btn-reject')) {
      console.log('Reject button clicked');
      const jobElement = event.target.closest('[data-job-id]');
      if (!jobElement) {
        console.error('No job container found');
        return;
      }
      const jobId = jobElement.dataset.jobId;

      console.log('Job ID:', jobId);
    }
  });



  // document.getElementById('reject_btn').addEventListener('click', async (event) => {
  //   console.log('Reject button clicked');
  //   const jobElement = event.target.closest('[data-job-id]');
  //   if (!jobElement) {
  //     console.error('No job container found');
  //     return;
  //   }
  //   const jobId = jobElement.dataset.jobId;

  //   const url = `http://127.0.0.1:5016/customer/jobs/reject-job/${jobId}`;
  //   const data = {}; // Reemplaza con los datos que quieres enviar

  //   try {
  //     const response = await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}` // Asegúrate de tener el token correcto
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     console.log(result);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // });


  //////////////////////////////////////////////////////////////////////////
});













// for (const job of data.jobs) {

//   const newContainer = existingContainer.cloneNode(true);
//   getUserData(job.idSpecialist, newContainer);
//   newContainer.removeAttribute('hidden');
//   newContainer.querySelector('.problem-description p').textContent = job.description;

//   if (job.state === 'PENDING' || job.state === 'ACCEPTED') {
//     if (job.state === 'PENDING') {
//       newContainer.querySelector('#job-status').textContent = 'Pendiente';
//     }
//     if (job.state === 'ACCEPTED') {
//       newContainer.querySelector('#job-status').textContent = 'Aceptado';
//     }

//     document.querySelector('.jobs-in-progress').appendChild(newContainer);
//   } else if (job.state === 'REJECTED' || job.state === 'FINISHED') {
//     if (job.state === 'REJECTED') {
//       newContainer.querySelector('#job-status').textContent = 'Rechazado';
//     }
//     if (job.state === 'FINISHED') {
//       newContainer.querySelector('#job-status').textContent = 'Finalizado';
//     }

//     document.querySelector('#jobs-history').appendChild(newContainer);
//   }
// }