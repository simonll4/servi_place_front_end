document.addEventListener('DOMContentLoaded', function () {


  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

  // trae a los especialistas
  fetch(`http://127.0.0.1:5016/customer/dashboard/specialists`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      if (Array.isArray(data.SPECIALIST)) {
        data.SPECIALIST.forEach(async (specialist) => {
          const newCard = existingCard[0].cloneNode(true);


          const profileButton = newCard.querySelector('.show-profile');
          profileButton.href = `/src/page/customer/profile/profile.html?id=${specialist.id}`;

          newCard.querySelector('#name').textContent = `${capitalize(specialist.name)}`;
          newCard.querySelector('#lastname').textContent = `${capitalize(specialist.last_name)}`;
          newCard.querySelector('.profile-image img').src = specialist.profile_picture;
          newCard.querySelector('#paragraph').textContent = specialist.description;
          newCard.querySelector('.specialist-profile').id = specialist.id;
          newCard.querySelector('.profile-image img').addEventListener('click', async function (event) { });

          const fakeEvent = {
            target: newCard
          };
          await getSpecialistCategories(fakeEvent,newCard, specialist.id);

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

  // setea las insignias del especialista
  async function getSpecialistCategories(event,newCard, specialistId) {

    const url = `http://127.0.0.1:5016/customer/profile/categories/${specialistId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const categoryTexts = {
      1: 'Albañil',
      2: 'Gasista',
      3: 'Plomero',
      4: 'Pintor',
      5: 'Electricista'
    };


    const badgesContainer = newCard.querySelector('#badges');
    badgesContainer.style.display = 'flex';
    badgesContainer.innerHTML = '';

    data.forEach(category => {
      const badge = document.createElement('div');
      badge.className = 'required-category col-1';
      const span = document.createElement('span');
      span.id = 'id_category';
      span.textContent = categoryTexts[category.categoryId];
      badge.appendChild(span);
      badgesContainer.appendChild(badge);
    });
  }

  // evento para ir al perfil del especialista
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.rounded-5')) {
      const specialistProfile = event.target.closest('.specialist-profile');
      const specialistId = specialistProfile ? specialistProfile.id : null;
      window.location.href = `/src/page/customer/profile/profile.html?id=${specialistId}`
    }
  });


});