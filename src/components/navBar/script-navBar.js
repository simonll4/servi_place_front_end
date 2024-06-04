import { showToast } from '../toast/toast.js'
import { ip } from '../../config.js';

// manejo de efectos de dropdown
const profile = document.querySelector('.profile');
const dropdown = document.querySelector('.dropdown__wrapper');
profile.addEventListener('click', () => {
    dropdown.classList.remove('none');
    dropdown.classList.toggle('hide');;
})
document.addEventListener("click", (event) => {
    const isClickInsideDropdown = dropdown.contains(event.target);
    const isProfileClicked = profile.contains(event.target);

    if (!isClickInsideDropdown && !isProfileClicked) {
        dropdown.classList.add('hide');
        dropdown.classList.add('dropdown__wrapper--fade-in');
    }

});

// scroll to top
const logoCompanyElement = document.querySelector('.logo-company');
logoCompanyElement.addEventListener('click', () => {
    window.scrollTo(0, 0);
});


////////////////////////////////////////////////////////////////////////////////////////

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const userUrl = `${ip}/${role.toLowerCase()}/my-profile/my-information`;
fetch(userUrl, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
    .then(response => response.json())
    .then(data => {

        const userNameElement = document.querySelector('.user-name');
        const emailElement = document.querySelector('.email');
        const profileImageElement = document.querySelector('.profile');

        userNameElement.textContent = data.name;
        emailElement.textContent = data.email;
        if (typeof data.profile_picture === 'string' && data.profile_picture.trim() !== '') {
            profileImageElement.src = data.profile_picture;
        }
        //profileImageElement.src = data.profile_picture;

    })
    .catch(error => console.error('Error:', error));

// Log out
const logoutElement = document.querySelector('#log_out');
logoutElement.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.clear();

    if ('caches' in window) {
        caches.keys().then(names => {
            for (let name of names)
                caches.delete(name);
        });
    }

    location.reload();
    window.location.href = "../../index.html";
});



// Evento para imprimir el toast.
window.addEventListener('toast', (event) => {
    showToast(event.detail.message, event.detail.success);
});
