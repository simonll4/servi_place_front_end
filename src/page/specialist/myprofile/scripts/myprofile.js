document.addEventListener('DOMContentLoaded', function () {

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "../../index.html";
        return;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // url para mostrar el resumen de las opiniones
    document.querySelector('.opinions_avg iframe').src = `/src/components/opinions/opinions.html?id=${localStorage.getItem('id')}`;

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

            localStorage.setItem('id', user.id);

            const profileName = document.querySelector('.profile-name');
            const userProfilePhoto = document.querySelectorAll('#profile-image');
            const description = document.querySelector('#about-me');

            if (user.description !== "") {
                description.textContent = user.description;
            }
            const articleName = document.querySelector('#article-name');
            articleName.textContent = `${capitalize(user.name)}, ${capitalize(user.last_name)}`;

            profileName.textContent = `${capitalize(user.name)}, ${capitalize(user.last_name)}`;
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

        articleData.textContent = data.article.paragraph;
        publicationImage.src = data.article.image;
        category.textContent = data.article.category.name;

    }).catch(error => {
        console.error('Hubo un problema con tu operación fetch:', error);
    })


});