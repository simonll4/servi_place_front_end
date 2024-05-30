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
    // datos del user
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

    // set my categories
    async function getMyCategories() {
        const url = 'http://127.0.0.1:5016/specialist/my-profile/categories';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const badgesContainer = document.querySelector('.badges');

        const categoryTexts = {
            1: 'Albañil',
            2: 'Gasista',
            3: 'Plomero',
            4: 'Pintor',
            5: 'Electricista'
        };

        badgesContainer.innerHTML = '';
        data.forEach(item => {
            const badge = document.createElement('div');
            badge.className = 'insignia  col-1';

            // Usa el ID de la categoría para obtener el texto correspondiente
            badge.textContent = categoryTexts[item.categoryId];

            badgesContainer.appendChild(badge);
        });

    }
    getMyCategories();
});


// creo que esta funcion esta por de mas
// document.addEventListener('DOMContentLoaded', () => {
//     const token = localStorage.getItem('token');
//     fetch('http://127.0.0.1:5016/specialist/my-profile/my-information', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     }).then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     }).then(data => {

//         document.querySelector('.profile-name').textContent = `${capitalize(data.name)}, ${capitalize(data.last_name)}`;
//         document.querySelector('#profile-pic').src = data.profile_picture;

//     }).catch(error => {
//         console.error('Hubo un problema con tu operación fetch:', error);
//     })
// });





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

    console.log(photoValue.files[0]);

    if (nameValue !== "") data['name'] = nameValue;
    if (lastNameValue !== "") data['last_name'] = lastNameValue;
    if (emailValue !== "") data['email'] = emailValue;
    if (descriptionValue !== "") data['description'] = descriptionValue;
    if (photoValue.files.length > 0) {
        data['profile_picture'] = await uploadProfilePicture(photoValue);
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

    location.reload();
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

//CATEGORIAS DEL ESPACILISTA

async function setCategory(id) {
    const url = `http://127.0.0.1:5016/specialist/my-profile/category/${id}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function deleteCategory(id) {
    const url = `http://127.0.0.1:5016/specialist/my-profile/category/${id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

document.getElementById('edit-profile-button').addEventListener('click', fetchAndCheckCategories);

// traer las categorias que ya tiene el especialista
async function fetchAndCheckCategories() {
    const url = 'http://127.0.0.1:5016/specialist/my-profile/categories';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.forEach(item => {
        const checkbox = document.getElementById(item.categoryId.toString());
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}


// inputs de las categorias del espacialista
const checkboxes = document.querySelectorAll('.btn-check');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
        console.log(token)
        switch (checkbox.id) {
            case '1':
                if (checkbox.checked) {
                    await setCategory(checkbox.id);
                } else {
                    await deleteCategory(checkbox.id);
                }
                break;
            case '2':
                if (checkbox.checked) {
                    await setCategory(checkbox.id);
                } else {
                    await deleteCategory(checkbox.id);
                }
                break;
            case '3':
                if (checkbox.checked) {
                    await setCategory(checkbox.id);
                } else {
                    await deleteCategory(checkbox.id);
                }
                break;
            case '4':
                if (checkbox.checked) {
                    await setCategory(checkbox.id);
                } else {
                    await deleteCategory(checkbox.id);
                }
                break;
            case '5':
                if (checkbox.checked) {
                    await setCategory(checkbox.id);
                } else {
                    await deleteCategory(checkbox.id);
                }
                break;
            default:
                console.log('Unknown checkbox');
                break;
        }
    });
});
