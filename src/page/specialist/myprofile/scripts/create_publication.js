document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

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

  document.getElementById('publication-form').addEventListener('submit', async function (event) {
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

    const data = {
      image: urlPhoto,
      categoryId: Number(serviceId),
      title: title,
      paragraph: description
    };

    fetch('http://127.0.0.1:5016/specialist/dashboard/create-article', {
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
  });
});