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
 
    console.log("2do fetch")
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
        console.log("2do fetch")
        
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