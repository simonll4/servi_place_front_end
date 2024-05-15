
document.addEventListener('DOMContentLoaded', function () {

  //1//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzE1Nzc5ODc3LCJleHAiOjE3MTU4NjYyNzd9.T9fU677tjYFISN_8a4cV04aXc56i3iHbprgweGPMfaA
  //2//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c3VhcmlvQGhvdG1haWwuY29tIiwiaWF0IjoxNzE1Nzc5OTIyLCJleHAiOjE3MTU4NjYzMjJ9.HHf7gi3UEft4aKt62DSM86pH2vRDfYxEGSBsM_3R1QE
  //3//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzaW1vbkBob3RtYWlsLmNvbSIsImlhdCI6MTcxNTc5MDEzNiwiZXhwIjoxNzE1ODc2NTM2fQ.yLyuWTDNxOdSn8e6Fjv6Qhu0OTXy853pw-Ou43o9FmI

  var tokenInput = document.getElementById('token');
  // Agrega un manejador de eventos al campo de entrada
  tokenInput.addEventListener('input', function () {
    let token = String(tokenInput.value);
    localStorage.setItem('token', token)
    console.log('El valor del token es:', token);
  });


  var idInput = document.getElementById('postId');
  // Agrega un manejador de eventos al campo de entrada
  idInput.addEventListener('input', function () {
    let postId = String(idInput.value);
    console.log('El valor del id del post es:', postId);
    localStorage.setItem('articleId', postId);
  });



  // var buttons = document.getElementsByName('article')
  // // Agrega un manejador de eventos a cada botón
  // buttons.forEach(function (button) {
  //   button.addEventListener('click', function (event) {
  //     // El botón que fue presionado es event.target
  //     localStorage.setItem('idArticle', event.target.id);
  //   });
  // });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
});