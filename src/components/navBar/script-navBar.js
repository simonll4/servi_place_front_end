const profile = document.querySelector('.profile');
const dropdown = document.querySelector('.dropdown__wrapper');


// Select the elements
const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.email');
const userProfilePhoto = document.querySelector('.profile');


//Una asquerosidad pero no me lo tomaba si no.
let flagFetch = false;
if(!flagFetch){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const path = (role === 'SPECIALIST') ? 'specialist' : 'customer';
    fetch(`http://127.0.0.1:5016/${path}/my-profile/my-information`, {
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
        // Update the text content of the selected elements
        userName.textContent = user.name + " " + user.last_name;
        userEmail.textContent = user.email;

        // Update the src attribute of the img element
        userProfilePhoto.src = user.profilePhotoUrl;
        flagFetch = true;
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}
    



profile.addEventListener('click', () => {
    dropdown.classList.remove('none');
    dropdown.classList.toggle('hide');
})

document.addEventListener("click", (event) => {
    const isClickInsideDropdown = dropdown.contains(event.target);
    const isProfileClicked = profile.contains(event.target);

    if (!isClickInsideDropdown && !isProfileClicked) {
        dropdown.classList.add('hide');
        dropdown.classList.add('dropdown__wrapper--fade-in');
    }
});
