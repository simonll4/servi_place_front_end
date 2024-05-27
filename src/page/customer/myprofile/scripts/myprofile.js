document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "../../index.html";
        return;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

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
        document.querySelector('.profile-name').textContent = `${capitalize(data.name)}, ${capitalize(data.last_name)}`;
        document.querySelector('#profile-pic').src = data.profile_picture;

    }).catch(error => {
        console.error('Hubo un problema con tu operación fetch:', error);

    })
})