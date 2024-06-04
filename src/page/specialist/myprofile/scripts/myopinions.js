import { ip } from '../../../../config.js'

document.addEventListener("DOMContentLoaded", (event) => {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  // indicar ruta del preview de la opiniones
  document.querySelector('#pre_view_opinions').src = `/src/components/opinions/opinions.html?id=${localStorage.getItem('id')}`;

  // Loading spinner
  document.getElementById("loading").hidden = false;

  fetch(`${ip}/specialist/my-profile/my-information`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(user => {
      const profileName = document.querySelector('#profile-name');
      const userProfilePhoto = document.querySelectorAll('#profile-image');

      // Actualiza el contenido de texto de los elementos seleccionados
      profileName.textContent = `${capitalize(user.name)}, ${capitalize(user.last_name)}`;
      // Actualiza el atributo src del elemento img del articulo tmb
      userProfilePhoto.forEach(element => {
        element.src = user.profile_picture;
      });

      // Ocultar el spinner después de procesar los datos del usuario
      document.getElementById('loading').hidden = true;

    })
    .catch(error => {
      console.error('Hubo un problema con tu operación fetch:', error);
      // Ocultar el spinner después de procesar los datos del usuario
      document.getElementById('loading').hidden = true;
    });


  fetch(`${ip}/specialist/my-profile/my-reviews`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      var opinions = data.reviews;
      var container = document.querySelector(".opinions");
      var h6Element = container.querySelector("h6");
      var lastRow;

      var opinionsNumberSpan = document.querySelector("#opinions_number");
      opinionsNumberSpan.textContent = `(${opinions.length})`;

      opinions.forEach(function (opinion, index) {
        var opinionDiv = document.createElement("div");
        opinionDiv.className = "client_opinion col";

        var starPercentage = (opinion.reviewRating / 5) * 100;
        var starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

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
            <p class="ps-3">${opinion.reviewContent}</p>
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
    });
});