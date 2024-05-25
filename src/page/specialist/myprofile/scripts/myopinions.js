// Obtén el contenedor de opiniones
let container = document.querySelector(".opinions");

// Encuentra el elemento h6
let h6Element = container.querySelector("h6");

// Crea una variable para almacenar la última row
let lastRow;

// Encuentra el span con id "opinions_number" y establece su contenido de texto al número de opiniones
let opinionsNumberSpan = document.querySelector("#opinions_number");

// Fetch opinions from the server

document.addEventListener("DOMContentLoaded", (event) => {
  fetch('http://127.0.0.1:5016/specialist/my-profile/my-information', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
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
    profileName.textContent = user.name + ", " + user.last_name;
    // Actualiza el atributo src del elemento img del articulo tmb
    userProfilePhoto.forEach(element => {
        element.src = user.profile_picture;
    });
})
.catch(error => {
    console.error('Hubo un problema con tu operación fetch:', error);
});








fetch("http://127.0.0.1:5016/specialist/my-profile/my-reviews", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})
  .then(response => response.json())
  .then(opinions => {
    console.log(opinions.reviews.length)
    opinionsNumberSpan.textContent = `(${opinions.reviews.length})`;

    // Itera sobre las opiniones
    opinions.reviews.forEach(function (opinion, index) {
      console.log(opinion);
      // Crea un nuevo div para la opinión
      let opinionDiv = document.createElement("div");
      opinionDiv.className = "client_opinion col"; // Cambiado de 'col-5' a 'col'

      // Calcula el porcentaje de la puntuación
      let starPercentage = (opinion.reviewRating / 5) * 100;

      // Redondea al 10% más cercano
      let starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

      // Agrega el contenido de la opinión al div
      opinionDiv.innerHTML = `
          <div class="row">
            <div class="profile-info d-flex">
              <div class="publication-profile-image d-flex">
                <img src="${opinion.reviewClientPicture}" alt="profile_image" class="rounded-5" />
              </div>
              <div class="my-profile-details">
                <p class="fw-bold">
                  <span id="name">${opinion.reviewClientName}</span>,
                  <span id="lastname">${opinion.reviewClientLastName}</span>
                </p>
                <!-- stars -->
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

      // Si es la primera opinión o una opinión impar, crea una nueva row
      if (index % 2 === 0) {
        lastRow = document.createElement("div");
        lastRow.className = "row";
      }

      // Agrega la opinión a la row
      lastRow.appendChild(opinionDiv);

      // Si es una opinión par o la última opinión, agrega la row al contenedor
      if (index % 2 === 1 || index === opinions.length - 1) {
        container.insertBefore(lastRow, h6Element.nextSibling);
      }
    });
  })
  .catch(error => {
    console.error("Error fetching opinions:", error);
  });

});
