// Supongamos que estas son las opiniones obtenidas del servidor
var opinions = [
  {
    name: "Juan",
    lastname: "Vazquez",
    score: 4.5,
    image: "/src/resources/img/worker1.jpg",
    description: "Great service!",
  },
  {
    name: "Maria",
    lastname: "Lola",
    score: 3.5,
    image: "/src/resources/img/worker2.jpg",
    description: "Good job!",
  },
  {
    name: "Esteban",
    lastname: "Perez",
    score: 2.5,
    image: "/src/resources/img/worker3.jpg",
    description: "no se usar facebook!",
  },
  {
    name: "Oscar",
    lastname: "Atta",
    score: 1,
    image: "/src/resources/img/client-pic.jpg",
    description: "se robó el termotanque!",
  },
  // ...
];

// Obtén el contenedor de opiniones
var container = document.querySelector(".opinions");

// Encuentra el elemento h6
var h6Element = container.querySelector("h6");

// Crea una variable para almacenar la última row
var lastRow;

// Encuentra el span con id "opinions_number" y establece su contenido de texto al número de opiniones
var opinionsNumberSpan = document.querySelector("#opinions_number");
opinionsNumberSpan.textContent = `(${opinions.length})`;

// Itera sobre las opiniones
opinions.forEach(function (opinion, index) {
  // Crea un nuevo div para la opinión
  var opinionDiv = document.createElement("div");
  opinionDiv.className = "client_opinion col"; // Cambiado de 'col-5' a 'col'

  // Calcula el porcentaje de la puntuación
  var starPercentage = (opinion.score / 5) * 100;

  // Redondea al 10% más cercano
  var starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

  // Agrega el contenido de la opinión al div
  opinionDiv.innerHTML = `
      <div class="row">
        <div class="profile-info d-flex">
          <div class="publication-profile-image d-flex">
            <img src="${opinion.image}" alt="profile_image" class="rounded-5" />
          </div>
          <div class="my-profile-details">
            <p class="fw-bold">
              <span id="name">${opinion.name}</span>,
              <span id="lastname">${opinion.lastname}</span>
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
          <p>${opinion.description}</p>
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
