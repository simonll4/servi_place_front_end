document.addEventListener('DOMContentLoaded', function () {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

 // obtenemos la info DEL USER
 fetch(`http://127.0.0.1:5016/customer/my-profile/my-information`, {
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
    document.querySelector('.profile-name').innerHTML = data.name;
    document.querySelector('.profile-lastname').innerHTML = data.last_name;
  })
  .catch(error => console.error('Error:', error));


  //funcion para obtener el modelo de los articulos
  let existingArticle = [];
  const templatePaths = ['../profile/models/specialist-articles.html',];
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
    fetch(`http://127.0.0.1:5016/customer/my-profile/articles`, {
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
  
            newArticle.querySelector('.article-title').innerHTML = `<strong>${article.title}<strong>`;
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

});