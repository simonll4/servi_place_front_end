

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

const userUrl = `http://127.0.0.1:5016/${role.toLowerCase()}/my-profile/my-information`;
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
        profileImageElement.src = data.profile_picture;

    })
    .catch(error => console.error('Error:', error));

// Log out
const logoutElement = document.querySelector('#log_out');
logoutElement.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    location.reload();
    window.location.href = "../../index.html";
});




