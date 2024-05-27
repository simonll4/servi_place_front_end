document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    fetch('http://127.0.0.1:5016/specialist/my-profile/my-information', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(user => {
        const profileName = document.querySelector('.profile-name');
        const userProfilePhoto = document.querySelectorAll('#profile-image');
        const description = document.querySelector('#about-me');
        console.log(userProfilePhoto)
        if(user.description !== ""){
            description.textContent = user.description;
        }
        const articleName = document.querySelector('#article-name');
        articleName.textContent = user.name + "," + " " + user.last_name;

        // Actualiza el contenido de texto de los elementos seleccionados
        profileName.textContent = user.name + "," + " " + user.last_name;
        // Actualiza el atributo src del elemento img del articulo tmb
        userProfilePhoto.forEach(element => {
            element.src = user.profile_picture;
        });
    })
    .catch(error => {
        console.error('Hubo un problema con tu operación fetch:', error);
    });
 
    fetch('http://127.0.0.1:5016/specialist/my-profile/last-article', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        
        const articleData = document.querySelector('#article-data');
        const publicationImage = document.querySelector('#publication-image');
        const category = document.querySelector('#id_category');
        console.log(category.textContent);
        console.log(data.article)

        articleData.textContent = data.article.paragraph;
        publicationImage.src = data.article.image;
        category.textContent = data.article.category.name;

    }).catch(error =>{
        console.error('Hubo un problema con tu operación fetch:', error);
    })


});


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
    const descriptionValue = document.querySelector('#aboutme').value

    if(nameValue !== "") data['name'] = nameValue;
    if(lastNameValue !== "") data['last_name'] = lastNameValue;
    if(emailValue !== "") data['email'] = emailValue;
    if(descriptionValue !== "") data['description'] = descriptionValue;
    if(photoValue.files.length > 0){
        data['profilePhoto'] = await uploadProfilePicture(photoValue);
    }

    fetch('http://127.0.0.1:5016/specialist/my-profile/my-information', {
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