document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    fetch('http://127.0.0.1:5016/customer/my-profile/my-information', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        document.querySelector('.profile-name').textContent = data.name + ", " + data.last_name;
        document.querySelector('#profile-pic').src = data.profile_picture;

    }).catch(error => {
        console.error('Hubo un problema con tu operación fetch:', error);
        

    })
})

//MODIFICAR PERFIL...

document.querySelector('#submit-button').addEventListener('click', async (event) => {
    //Evito que redirija...
    event.preventDefault();

    //Tendriamos que verificar primero todo...
    let data = {}
    const token = localStorage.getItem('token');
    const nameValue = document.querySelector('#name').value
    const lastNameValue = document.querySelector('#lastname').value
    const emailValue = document.querySelector('#email').value
    const photoValue = document.querySelector('#image-upload')

    if(nameValue !== "") data['name'] = nameValue;
    if(lastNameValue !== "") data['last_name'] = lastNameValue;
    if(emailValue !== "") data['email'] = emailValue;
    if(photoValue.files.length > 0){
        data['profilePhoto'] = await uploadProfilePicture(photoValue);
    }

    fetch('http://127.0.0.1:5016/customer/my-profile/my-information', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Handle successful response
        console.log('Profile updated successfully');
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    


    
})


async function uploadProfilePicture(profilePicture) {
    const formData = new FormData();
    formData.append("image", profilePicture.files[0]);
    console.log(profilePicture.files[0])

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