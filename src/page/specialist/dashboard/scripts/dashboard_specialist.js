import { ip } from '../../../../config.js';
document.addEventListener('DOMContentLoaded', function () {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  //funcion para obtener el modelo de los articulos
  let existingArticle = [];
  const templatePaths = ['models/customer-articles.html',];
  const fetchPromises = templatePaths.map((path) => {
    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const jobContainer = doc.querySelector('.client-publication');
        existingArticle.push(jobContainer);
      });
  });

  // obtiene los datos del usuario y los guarda en el articulo
  function getUserData(customerId, newContainer) {
    const userUrl = `${ip}/specialist/profile/user-information/${customerId}`;
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

      })
      .catch(error => console.error('Error:', error));
  }

  function fetchArticles() {
    const activeIds = Array.from(document.querySelectorAll('.btn-check:checked')).map(checkbox => checkbox.id);

    // borra los articulos existentes para mostrar los nuevos
    const existingArticles = document.querySelectorAll('.client-publication');
    existingArticles.forEach((article) => {
      article.remove();
    });

    // borra el mensaje de no hay articulos
    const existingMessage = document.querySelector('.section-container.text-center');
    if (existingMessage) {
      existingMessage.remove();
    }


    const articlesUrl = `${ip}/specialist/dashboard/articles?categories=${activeIds}`;
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
          data.articles.forEach((article) => {
            const newArticle = existingArticle[0].cloneNode(true);

            newArticle.querySelector('#contact').href = `../chat/chat.html?id=${article.authorId}`;

            getUserData(article.authorId, newArticle);
            newArticle.querySelector('.article-title').textContent = article.title;
            newArticle.querySelector('.article-content').textContent = article.paragraph;
            newArticle.querySelector('.post_image img').src = article.image;
            newArticle.querySelector('.required-category span').textContent = article.category.name;

            const container = document.querySelector('.container-fluid.latest-services');
            if (container) {
              container.appendChild(newArticle);
            }
          });
        }

        // agregado de mensaje si no hay articulos
        const articlesContainer = document.querySelector('.container-fluid.latest-services');
        if (articlesContainer.children.length <= 3) {
          let div = document.createElement('div');
          div.className = "section-container text-center";
          let p = document.createElement('p');
          p.className = "fw-light p-5";
          p.textContent = "No hay publicaciones para mostrar";
          div.appendChild(p);
          articlesContainer.appendChild(div);
        }

      })
      .catch(error => console.error('Error:', error));

  }

  // se llama al principio para que se muestren los articulos (get all)
  fetchArticles();
  // dependiendo los filtros seleccionado me trae los articulos
  document.querySelectorAll('.btn-check').forEach((checkbox) => {
    checkbox.addEventListener('change', fetchArticles);
  });

  ////////////////////////////////////////////////////////////////////////////////////
});