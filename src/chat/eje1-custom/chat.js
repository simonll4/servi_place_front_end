import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'


document.addEventListener('DOMContentLoaded', function () {
  // Este código se ejecutará después de que el DOM esté listo

  const idArticle = localStorage.getItem('articleId');
  localStorage.removeItem('articleId');
  const token = localStorage.getItem('token');
  console.log('hola:', token);

  let sesionId
  let receiverId


  const form = document.getElementById('formMsg');
  const input = document.getElementById('inputMsg');
  const messages = document.getElementById('messages');

  // establezco conexión con el servidor de socket
  // paso el token como query
  const socket = io('http://localhost:5050', {
    query: {
      token: token
    }
  });

  (() => {
    socket.emit('chat history', idArticle);
    console.log('id articulo: ', idArticle);
  })();


  // obtengo id de la sesión
  socket.on('send sesionId', (idSesion) => {
    sesionId = idSesion;
    console.log('idSesion:', sesionId);
  });



  // si hay un historial de mensajes, los muestro en el chat
  socket.on('set chat history', (msgs, id) => {
    console.log(msgs);

    receiverId = id;

    msgs.forEach(msg => {
      const item = document.createElement('li');
      item.textContent = msg.content;
      if (msg.authorId == id) {
        item.classList.add('repaly');
      }
      else {
        item.classList.add('sender');
      }
      messages.appendChild(item);
    });
    window.scrollTo(0, document.body.scrollHeight);

  });

  // evento de enviar mensaje
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('new message', input.value, idArticle);
      input.value = '';
    }
  });

  // // evento de recibir mensaje
  // socket.on('set message', (msg) => {
  //   const item = document.createElement('li');
  //   item.textContent = msg;
  //   messages.appendChild(item);
  //   window.scrollTo(0, document.body.scrollHeight);
  // });

  socket.on('set message', (msg) => {
    console.log('set mensaje:', msg);

    const item = document.createElement('li');
    item.textContent = msg.content;

    // // Agrega la clase 'sender' al elemento 'li'
    // item.classList.add('sender');

    console.log('idSesion:', sesionId);
    console.log('id:', receiverId);
    if (msg.authorId == sesionId) {
      item.classList.add('repaly');
      messages.appendChild(item);
    }
    else if (msg.authorId == receiverId) {
      item.classList.add('sender');
      messages.appendChild(item);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });


  // evento de error
  socket.on('socket error', (error) => {
    //console.log('Error received from server: ', error.message);
    console.error('An error occurred:', JSON.stringify(error, null, 2));
  });

});