document.addEventListener('DOMContentLoaded', (event) => {


  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let data = {};
    let formElements = document.querySelectorAll('form input:not([type="file"])');

    formElements.forEach(function (input) {
      data[input.name] = input.value;
    });

    fetch('http://127.0.0.1:5016/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });
  });




  // document.querySelector('form').addEventListener('submit', function (event) {
  //   event.preventDefault();

  //   var reader = new FileReader();
  //   reader.readAsDataURL(document.querySelector('#upload-file').files[0]);

  //   reader.onload = function () {
  //     var imageBase64 = reader.result;

  //     var name = document.querySelector('#name').value;
  //     var lastname = document.querySelector('#lastname').value;
  //     var email = document.querySelector('#email').value;
  //     var password = document.querySelector('#password').value;
  //     var passwordConfirm = document.querySelector('#password-confirm').value;
  //     var tipoCuenta = document.querySelector('[name="tipo-cuenta"]').value;

  //     var data = {
  //       name: name,
  //       lastname: lastname,
  //       email: email,
  //       password: password,
  //       passwordConfirm: passwordConfirm,
  //       tipoCuenta: tipoCuenta,
  //       image: imageBase64
  //     };

  //     fetch('http://127.0.0.1:5016/auth/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     })
  //       .then(response => {
  //         if (!response.ok) {
  //           return response.text().then(text => {
  //             throw new Error(text);
  //           });
  //         }
  //         return response.json();
  //       })
  //       .then(data => console.log(data))
  //       .catch(error => console.error('Error:', error));
  //   };

  // });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});


