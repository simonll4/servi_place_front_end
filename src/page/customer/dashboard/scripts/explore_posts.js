document.addEventListener('DOMContentLoaded', (event) => {

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = "../../index.html";
  return;
}

  //funcion para obtener el modelo de los articulos
  let existingArticle = [];
  const templatePaths = ['models/specialist-articles.html',];
  const fetchPromises = templatePaths.map((path) => {
    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const jobContainer = doc.querySelector('.specialist-publication');
        existingArticle.push(jobContainer);
      });
  });

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
        if (data.profile_picture == '') {
          data.profile_picture = `../../../resources/img/anonymous-user.jpg`;
        }
        newContainer.querySelector('.profile-image img').src = data.profile_picture;
        newContainer.querySelector('.specialist-profile').id = data.id;
      })
      .catch(error => console.error('Error:', error));
  }

 
function fetchArticles() {
  const activeIds = Array.from(document.querySelectorAll('.btn-check:checked')).map(checkbox => checkbox.id);

  // borra los articulos existentes para mostrar los nuevos
  const existingArticles = document.querySelectorAll('.specialist-publication');
  existingArticles.forEach((article) => {
    article.remove();
  });

  const articlesUrl = `http://127.0.0.1:5016/customer/dashboard/articles?categories=${activeIds}`;

  fetch(articlesUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      if (Array.isArray(data.articles)) {
        data.articles.forEach((article, index) => {
          const newArticle = existingArticle[0].cloneNode(true);

          getUserData(article.authorId, newArticle);
          newArticle.querySelector('.article-title').textContent = article.title;
          newArticle.querySelector('.article-content').textContent = article.paragraph;
          newArticle.querySelector('.post_image img').src = article.image;
          newArticle.querySelector('.required-category span').textContent = article.category.name;

          const profileButton = newArticle.querySelector('.show-profile');
          profileButton.href = `/src/page/customer/profile/profile.html?id=${article.authorId}`;

          const container = document.querySelector('.container-fluid.specialist-search');
          if (container) {
            container.appendChild(newArticle);
          }
        });
      }
    }).catch(error => console.error('Error:', error));
}

// se llama al principio para que se muestren los articulos (get all)
fetchArticles();
// dependiendo los filtros seleccionado me trae los articulos
document.querySelectorAll('.btn-check').forEach((checkbox) => {
  checkbox.addEventListener('change', fetchArticles);

});

  // evento para ir al perfil del especialista
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.rounded-5')) {
      const specialistProfile = event.target.closest('.specialist-profile');
      const specialistId = specialistProfile ? specialistProfile.id : null;
      window.location.href = `/src/page/customer/profile/profile.html?id=${specialistId}`
    }
  });

});