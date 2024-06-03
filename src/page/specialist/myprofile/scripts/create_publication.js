import { ip, clientImgur } from '../../../../config.js'

document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

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
      document.querySelector('.profile-name').innerHTML = `${capitalize(data.name)}, ${capitalize(data.last_name)}`;

    })
    .catch(error => console.error('Error:', error));


  async function uploadProfilePicture(profilePicture) {
    const formData = new FormData();
    formData.append("image", profilePicture.files[0]);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        'Authorization': clientImgur,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { data } = await response.json();
    return data.link;
  }

  document.getElementById('publication-form').addEventListener('submit', async function (event) {
    //Loading spinner
    document.getElementById('loading').style.display = 'block';
    event.preventDefault();

    const urlPhoto = await uploadProfilePicture(document.getElementById('profilePhoto'));
    const service = document.querySelector('select[name="service"]').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('paragraph').value;

    // Mapeo de servicios a IDs
    const serviceToId = {
      'albañil': 1,
      'gasista': 2,
      'plomero': 3,
      'pintor': 4,
      'electricista': 5
    };
    const serviceId = serviceToId[service];

    console.log('serviceId', description);

    const data = {
      image: urlPhoto,
      categoryId: Number(serviceId),
      title: title,
      paragraph: description
    };

    fetch(`${ip}/specialist/dashboard/create-article`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        location.reload();
      })
      .catch(error => console.error('Error:', error));
      // Ocultar el spinner independientemente de si se produce un error o no
      document.getElementById('loading').style.display = 'none';
  });
});