document.addEventListener("DOMContentLoaded", function () {

  //token (esto se deberia obtener del localStorage)
  //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE2NDIxMTYxLCJleHAiOjE3MTY1MDc1NjF9.ma15hbXlBwC-ImUquWhJm9XEjRvkATPFAe72MJ7nAKU'
  //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE2NDk1NzYyLCJleHAiOjE3MTY1ODIxNjJ9.qIvMIGb55rWfS2oQZ1Ac5H_-kI_vZUYfsR2muJzdt4E';

  const token = localStorage.getItem('token');


  //funcion para obtener los datos del usuario (nombre, apellido, imagen de perfil)
  //se obtiene el id del especialista y el contenedor donde se insertaran los datos
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
        newContainer.querySelector('.specialist-card').id = data.id;
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
  const templatePaths = ['models/pending-job.html', 'models/accepted-job.html', 'models/rejected-job.html', 'models/finished-job.html', 'models/commented-job.html'];
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
          'COMMENTED': existingContainer[4]
        };
      });
  };


  // se obtienen los trabajos del usuario y se insertan en los contenedores correspondientes
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
          const opinionButton = newContainer.querySelector('.btn-opinion');
          if (opinionButton) {
            opinionButton.addEventListener('click', async (event) => { });
          }

          // evento voton para ir al perfil del especialista
          newContainer.querySelector('.rounded-5').addEventListener('click', function (event) { });

          newContainer.dataset.jobId = job.id; // se guarda el id del trabajo en el contenedor como id del container-job id="data-job-id"
          getUserData(job.idSpecialist, newContainer);
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

          if (['PENDING', 'ACCEPTED'].includes(job.state)) {
            document.querySelector('.jobs-in-progress').appendChild(newContainer);
          } else if (['REJECTED', 'FINISHED', 'COMMENTED'].includes(job.state)) {
            document.querySelector('#jobs-history').appendChild(newContainer);
          }
        }
      });
    })
    .catch(error => console.error('Error:', error));


  ////////////////////////////////EVENTOS//////////////////////////////////////////////////////

  document.addEventListener('click', async (event) => {
    if (event.target.matches('.btn-accept')) {
      const jobElement = event.target.closest('[data-job-id]');
      if (!jobElement) {
        console.error('No job container found');
        return;
      }
      const jobId = jobElement.dataset.jobId;
      console.log(jobId);

      try {
        const response = await fetch(`http://127.0.0.1:5016/customer/jobs/finish-job/${jobId}`, {
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

  // boton para cancelar trabajo, se inserta el idJob en la url
  let rejectUrl = ``;
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.btn-reject')) {
      const jobElement = event.target.closest('[data-job-id]');
      if (!jobElement) {
        console.error('No job container found');
        return;
      }
      const jobId = jobElement.dataset.jobId;
      rejectUrl = `http://127.0.0.1:5016/customer/jobs/reject-job/${jobId}`;
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


  // evento opinar sobre el trabajo
  let opinionUrl = ``;
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.opinion-btn')) {
      const jobElement = event.target.closest('[data-job-id]');
      if (!jobElement) {
        console.error('No job container found');
        return;
      }
      const jobId = jobElement.dataset.jobId;
      console.log(jobId);
      opinionUrl = `http://127.0.0.1:5016/customer/jobs/create-review/${jobId}`;
      console.log(opinionUrl);
    }
  });

  document.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault();

    const jobTitle = document.querySelector('#description').value;
    const jobDescription = document.querySelector('#rating').value;

    const data = {
      content: jobTitle,
      rating: Number(jobDescription)
    };

    try {
      const response = await fetch(opinionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);

      document.querySelector('.opinion-btn').setAttribute('hidden', '');
      location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  });


  // evento para ir al perfil del especialista
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.rounded-5')) {
      const specialistProfile = event.target.closest('.specialist-card');
      const specialistId = specialistProfile ? specialistProfile.id : null;
      window.location.href = `/src/page/customer/profile/profile.html?id=${specialistId}`
    }
  });


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});