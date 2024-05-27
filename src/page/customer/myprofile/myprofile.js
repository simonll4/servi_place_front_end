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