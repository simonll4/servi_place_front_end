import { ip } from '../../../../config.js'

document.addEventListener('DOMContentLoaded', function () {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

  // Loading spinner
  document.getElementById("loading").hidden = false;
  
  // // obtenemos la info DEL USER
  fetch(`${ip}/specialist/my-profile/my-information`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      localStorage.setItem('profile_picture', data.profile_picture);
      localStorage.setItem('name', data.name);
      localStorage.setItem('last_name', data.last_name);

      document.querySelector('.profile-image img').src = data.profile_picture;
      document.querySelector('.profile-name').innerHTML = capitalize(data.name);
      document.querySelector('.profile-lastname').innerHTML = capitalize(data.last_name);
    })
    .catch(error => console.error('Error:', error));

  //funcion para obtener el modelo de los articulos
  let existingArticle = [];
  const templatePaths = ['./models/specialist-articles.html',];
  const fetchPromises = templatePaths.map((path) => {
    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const jobContainer = doc.querySelector('.my-publication');
        existingArticle.push(jobContainer);
      });
  });

  // trae los articulos del user
  fetch(`${ip}/specialist/my-profile/articles`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      
      if (data.articles.length == 0) {
        console.log('No hay articulos');
        const container = document.querySelector('.section-container');
        container.innerHTML = ' <div class="section-container text-center"> <p class="fw-light p-5">No hay publicaciones para mostrar</p> </div>';
      }

      if (Array.isArray(data.articles)) {
        data.articles.forEach((article) => {
          const newArticle = existingArticle[0].cloneNode(true);

          newArticle.querySelector('#name').textContent = localStorage.getItem('name');
          newArticle.querySelector('#last_name').textContent = localStorage.getItem('last_name');
          newArticle.querySelector('.publication-profile-image img').src = localStorage.getItem('profile_picture');

          newArticle.querySelector('.article-title').innerHTML = `<strong>${article.title}<strong>`;
          newArticle.querySelector('.post-description').textContent = article.paragraph;
          newArticle.querySelector('.post_image img').src = article.image;
          newArticle.querySelector('.required-category span').textContent = article.category.name;

          const container = document.querySelector('.section-container');
          if (container) {
            container.appendChild(newArticle);
          }
        });
        // Ocultar el spinner después de procesar los datos del usuario
        document.getElementById('loading').hidden = true;
      }

    })
    .catch(error => {
      console.error(error);
      // Ocultar el spinner después de procesar los datos del usuario
      document.getElementById('loading').hidden = true;
    });

});