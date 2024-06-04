import { ip } from '../../../../config.js';

document.addEventListener('DOMContentLoaded', (event) => {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  let params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));

  // indicar ruta del preview de la opiniones
  document.querySelector('#pre_view_opinions').src = `/src/components/opinions/opinions.html?id=${id}`;


  // obtenemos la info del specialista
  fetch(`${ip}/customer/profile/user-information/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      localStorage.setItem('profile_picture', data.profile_picture);
      localStorage.setItem('name', data.name);
      localStorage.setItem('last_name', data.last_name);
      
      if (typeof data.profile_picture === 'string' && data.profile_picture.trim() !== '') {
        document.querySelector('.profile-image img').src = data.profile_picture;
      }

      document.querySelector('.profile-name').innerHTML = `${capitalize(data.name)}, ${capitalize(data.last_name)}`;
    })
    .catch(error => console.error('Error:', error));



  fetch(`${ip}/customer/profile/reviews/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
    .then(response => response.json())
    .then(data => {

      let opinions = data.reviews;
      let container = document.querySelector(".opinions");
      let h6Element = container.querySelector("h6");
      let lastRow;

      let opinionsNumberSpan = document.querySelector("#opinions_number");
      opinionsNumberSpan.textContent = `(${opinions.length})`;

      opinions.forEach(function (opinion, index) {
        let opinionDiv = document.createElement("div");
        opinionDiv.className = "client_opinion col";

        let starPercentage = (opinion.reviewRating / 5) * 100;
        let starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

        opinionDiv.innerHTML = `
        <div class="row">
          <div class="profile-info d-flex">
            <div class="publication-profile-image d-flex">
              <img src="${opinion.reviewClientPicture ? opinion.reviewClientPicture : '/src/resources/img/anonymous-user.jpg'}" alt="profile_image" class="rounded-5" />
            </div>
            <div class="my-profile-details">
              <p class="fw-bold">
                <span id="name">${opinion.reviewClientName}</span>,
                <span id="lastname">${opinion.reviewClientLastName}</span>
              </p>
              <span class="stars ms-2">
                <div class="stars-outer">
                  <div class="stars-inner" style="width: ${starPercentageRounded}"></div>
                </div>
              </span>
            </div>
          </div>
          <div class="post-description">
            <p>${opinion.reviewContent}</p>
          </div>
        </div>
      `;

        if (index % 2 === 0) {
          lastRow = document.createElement("div");
          lastRow.className = "row";
        }

        lastRow.appendChild(opinionDiv);

        if (index % 2 === 1 || index === opinions.length - 1) {
          container.insertBefore(lastRow, h6Element.nextSibling);
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // formulario solicitar trabajo
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('form submitted');
    const jobTitle = document.querySelector('#job_title').value;
    const jobDescription = document.querySelector('#job_description').value;
    const requestData = {
      name: jobTitle,
      description: jobDescription
    };


    fetch(`${ip}/customer/jobs/create-job/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        location.reload();
      })
      .catch(error => console.error('Error:', error));
  });


});