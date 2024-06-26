import {ip} from '../../../../config.js'


document.addEventListener('DOMContentLoaded', (event) => {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  let params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));

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

      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }
      document.querySelector('.profile-name').innerHTML = `${capitalize(data.name)}, ${capitalize(data.last_name)}`;
      document.querySelector('.profile-image img').src = data.profile_picture;
      document.querySelector('.profile-name').innerHTML = `${data.name}, ${data.last_name}`;
    })
    .catch(error => console.error('Error:', error));


  //funcion para obtener el modelo de los articulos
  let existingArticle = [];
  const templatePaths = ['models/specialist-articles.html',];
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
  fetch(`${ip}/customer/profile/articles/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      if (Array.isArray(data.articles)) {
        data.articles.forEach((article) => {
          const newArticle = existingArticle[0].cloneNode(true);

          newArticle.querySelector('#name').textContent = localStorage.getItem('name');
          newArticle.querySelector('#last_name').textContent = localStorage.getItem('last_name');
          newArticle.querySelector('.publication-profile-image img').src = localStorage.getItem('profile_picture');

          newArticle.querySelector('.article-title').textContent = article.title;
          newArticle.querySelector('.post-description').textContent = article.paragraph;
          newArticle.querySelector('.post_image img').src = article.image;
          newArticle.querySelector('.required-category span').textContent = article.category.name;

          const container = document.querySelector('.section-container');
          if (container) {
            container.appendChild(newArticle);
          }
        });
      }
    })
    .catch(error => {
      console.error(error);
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