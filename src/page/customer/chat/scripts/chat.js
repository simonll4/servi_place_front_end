import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

import {ip} from '../../../../config.js'


document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  let params = new URLSearchParams(window.location.search);
  const userId = Number(params.get('id'));
  let sesionId;

  console.log('id:', userId);

  const form = document.getElementById('form_msg');
  const input = document.getElementById('input_message');
  const messages = document.getElementById('.card-body.msg_card_body');

  let messagesMockups = [];
  const templatePaths = ['models/received-msg.html', 'models/sent-msg.html'];
  const fetchPromises = templatePaths.map((path) => {
    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const jobContainer = doc.querySelector('#msg');
        messagesMockups.push(jobContainer);
      });
  });


  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // obtenemos la info del user
  fetch(`${ip}/customer/profile/user-information/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      document.querySelector('#name').textContent = `${capitalize(data.name)} ${capitalize(data.last_name)}`;
      document.querySelector('.user_img').src = data.profile_picture;
      localStorage.setItem('received_img', data.profile_picture);

    })
    .catch(error => console.error('Error:', error));


  // establezco conexión con el servidor de socket
  const socket = io(`${ip}`, {
    query: {
      token: token
    }
  });

  // apenas se inicia en el chat pedimos el historial de mensajes
  (() => {
    socket.emit('chat history', userId);
  })();


  // obtengo id de la sesión
  socket.on('send sesionId', (idSesion) => {
    sesionId = idSesion;
    console.log('idSesion:', sesionId);
  });

  // evento de enviar mensaje
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('new message', input.value, userId);
      input.value = '';
    }
  });

  // evento de recibir mensaje
  socket.on('set message', (msg) => {
    console.log('set mensaje:', msg);

    // Obtener una referencia al contenedor de mensajes
    const messages = document.querySelector('.msg_card_body');

    // Clonar el template correspondiente
    const item = (msg.authorId == userId ? messagesMockups[0] : messagesMockups[1]).cloneNode(true);

    // Configurar el contenido del mensaje
    const p = item.querySelector('p');
    p.textContent = msg.content;

    // Configurar la hora del mensaje
    const span = item.querySelector('span');
    span.textContent = new Date().toLocaleTimeString(); // Ajustar esto para usar la hora del mensaje si está disponible

    //item.querySelector('#received_img').src = localStorage.getItem('received_img');

    // Añadir el mensaje al contenedor de mensajes
    messages.appendChild(item);

    messages.scrollTop = messages.scrollHeight;
  });


  // si hay un historial de mensajes, los muestro en el chat  
  socket.on('set chat history', (msgs) => {
    console.log(msgs);

    
    const messages = document.querySelector('.msg_card_body');

    msgs.forEach(msg => {
    
      const item = (msg.authorId == userId ? messagesMockups[0] : messagesMockups[1]).cloneNode(true);

      const p = item.querySelector('p');
      p.textContent = msg.content;

      const span = item.querySelector('span');
      span.textContent = new Date().toLocaleTimeString(); // Ajustar esto para usar la hora del mensaje si está disponible


      //item.querySelector('#received_img').src = localStorage.getItem('received_img');

 
      messages.appendChild(item);
    });

    messages.scrollTop = messages.scrollHeight;
  });


  // evento manejo de errores
  socket.on('socket error', (error) => {
    //console.log('Error received from server: ', error.message);
    console.error('An error occurred:', JSON.stringify(error, null, 2));
  });

});