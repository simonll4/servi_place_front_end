import { ip } from '../../../../config.js';


document.addEventListener('DOMContentLoaded', (event) => {

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  let params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));

  // url para mostrar el resumen de las opiniones
  document.querySelector('.opinions_avg iframe').src = `/src/components/opinions/opinions.html?id=${id}`;

  // url para mostrar las opiniones
  document.querySelector('#opinions-btn').href = `opinions.html?id=${id}`;

  // url para mostrar los articulos
  document.querySelector('#publications-btn').href = `/src/page/customer/profile/publications.html?id=${id}`;

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

      document.querySelector('.profile-name').innerHTML = `${capitalize(data.name)}, ${capitalize(data.last_name)}`;
      document.querySelector('.profile-image img').src = data.profile_picture;
      document.querySelector('#about-me').innerHTML = data.description;
    })
    .catch(error => console.error('Error:', error));

  // preview de los articulos
  fetch(`${ip}/customer/profile/last-article/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      if (data.article) {
        document.querySelector('#article_id').removeAttribute('hidden');
        document.querySelector('#publications-btn').removeAttribute('hidden');
      }

      // profile details
      document.querySelector('#name_2').innerHTML = localStorage.getItem('name');
      document.querySelector('#last_name_2').innerHTML = localStorage.getItem('last_name');
      document.querySelector('#profile_picture_2').src = localStorage.getItem('profile_picture');

      const requiredCategory = document.querySelector('.my-profile-details .required-category #id_category');
      const postDescription = document.querySelector('#paragraph');
      const postImage = document.querySelector('#post_image');

      requiredCategory.innerHTML = data.article.category.name;
      postDescription.innerHTML = data.article.paragraph;
      postImage.src = data.article.image;
    })
    .catch((error) => {
      console.error('Error:', error);
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