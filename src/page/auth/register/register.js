
document.addEventListener('DOMContentLoaded', (event) => {

  // upload the profile picture to imgur
  async function uploadProfilePicture(profilePicture) {
    const formData = new FormData();
    formData.append("image", profilePicture.files[0]);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: "Client-ID cc588f3c8316e27",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { data } = await response.json();
    return data.link;
  }

  // send the register form data to the server
  document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    document.getElementById('loading').style.display = 'block';


    let data = {};
    let formElements = document.querySelectorAll('form input');

    for (let input of formElements) {
      if (input.name === 'password-confirm' || input.type === 'submit') {
        continue;
      }
      if (input.id === 'profilePhoto' && input.files.length > 0) {
        data['profilePhoto'] = await uploadProfilePicture(input);
      } else {
        data[input.name] = input.value;
      }
    }

    // set the enum role
    let role = document.querySelector('select[name="role"]').value;
    if (role === 'especialista') {
      data['role'] = 'SPECIALIST';
    } else if (role === 'cliente') {
      data['role'] = 'CUSTOMER';
    }

    // send the register form data to the server
    fetch('http://127.0.0.1:5016/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {

        const authHeader = response.headers.get('Authorization');
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          localStorage.setItem('token', token);
          console.log(localStorage.getItem('token'));
        } else {
          console.error('No Authorization header in response');
        }
        return response.json();

      }).then(data => {

        localStorage.setItem('role', data.role);
        console.log(localStorage.getItem('role'));

        if (data.role === 'SPECIALIST') {
          window.location.href = '../../specialist/dashboard/dashboard_specialist.html';
        } else if (data.role === 'CUSTOMER') {
          window.location.href = '../../customer/dashboard/explore_posts.html';
        }

      }).catch((error) => {
        console.error('Error:', error);
        if (error.status === 409) {
          alert('El correo ya está registrado')
        }
      });
    document.getElementById('loading').style.display = 'none';
  });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



