
document.addEventListener('DOMContentLoaded', (event) => {

  const token = localStorage.getItem('token');
  let params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));

  //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE2NjU3MjEyLCJleHAiOjE3MTY3NDM2MTJ9.CxZmNE5UXcvPNpiDNMDd8W5luQGN4s5TxNUbca0wu58";
  //const id = 2;

  // url para mostrar el resumen de las opiniones
  document.querySelector('.opinions_avg iframe').src = `/src/components/opinions/opinions.html?id=${id}`;

  // url para mostrar las opiniones
  document.querySelector('#opinions-btn').href = `opinions.html?id=${id}`;

  // obtenemos la info del specialista
  fetch(`http://127.0.0.1:5016/customer/profile/user-information/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      document.querySelector('.profile-image img').src = data.profile_picture;
      document.querySelector('.profile-details .profile-name').innerHTML = data.name;
      document.querySelector('#about-me').innerHTML = data.description;
    })
    .catch(error => console.error('Error:', error));

});