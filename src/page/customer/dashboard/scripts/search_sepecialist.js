document.addEventListener('DOMContentLoaded', function () {


  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  //funcion para obtener el modelo de las tarjetas
  let existingCard = [];
  const templatePaths = ['models/specialist-cards.html',];
  const fetchPromises = templatePaths.map((path) => {
    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const jobContainer = doc.querySelector('.specialist-publication');
        existingCard.push(jobContainer);
      });
  });


  fetch(`http://127.0.0.1:5016/customer/dashboard/specialists`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (Array.isArray(data.SPECIALIST)) {
        data.SPECIALIST.forEach((specialist) => {
          const newCard = existingCard[0].cloneNode(true);


          const profileButton = newCard.querySelector('.show-profile');
          profileButton.href = `/src/page/customer/profile/profile.html?id=${specialist.id}`;

          newCard.querySelector('#name').textContent = specialist.name;
          newCard.querySelector('#lastname').textContent = specialist.last_name;
          newCard.querySelector('.profile-image img').src = specialist.profile_picture;
          newCard.querySelector('#paragraph').textContent = specialist.description;


          const container = document.querySelector('.container-fluid.specialist-search');
          if (container) {
            container.appendChild(newCard);
          }
        });
      }
    })
    .catch(error => {
      console.error(error);
    });

});