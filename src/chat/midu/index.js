import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

const userId1 = document.getElementById('inputname1');
const userId2 = document.getElementById('inputname2');
//let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzE1Njg5NjA3LCJleHAiOjE3MTU3NzYwMDd9.qVOXslyjISBIvp_g4UUhjtjMQUv8YGfRc8opN7Ee0xU'
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c3VhcmlvQGhvdG1haWwuY29tIiwiaWF0IjoxNzE1Njk0NTU4LCJleHAiOjE3MTU3ODA5NTh9.fribzHo14-bsKAyEV06HaECr9vdlOUHSvA2XpKuXBDk';
let num2

// userId1.addEventListener('change', (e) => {
//   num1 = e.target.value;
//   console.log(num1);
// });

userId2.addEventListener('change', (e) => {
  num2 = e.target.value;
  console.log(num2);
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const socket = io('http://localhost:5050', {
  query: {
    token: token
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('chat message', input.value, token, num2);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});


// hago click sobre el boton de mensaje para abrir el chat, esto deberia ser en una pantalla anterior al chat
const button = document.getElementById('myStyledButton');
button.addEventListener('click', () => {
  socket.emit('chat history', token, num2);
});

// si hay un historial de mensajes, los muestro en el chat
socket.on('set chat history', (msgs) => {
  msgs.forEach(msg => {
    const item = document.createElement('li');
    item.textContent = msg.content; // Accede al campo 'content' de cada objeto
    messages.appendChild(item);
  });
  window.scrollTo(0, document.body.scrollHeight);
});

// evento manejo de errores en los sockets
socket.on('scoket error', (errorMessage) => {
  console.error('An error occurred:', errorMessage);
  // Aquí puedes manejar el error como quieras, por ejemplo, mostrando un mensaje al usuario
});


//////////////////////////////////////////////////////////////////////////////////////////////////
// const GETPAGE = 'http://localhost:5050';

// function loadBackend() {
//   fetch(GETPAGE)
//     .then((msg) => {
//       if (!msg.ok) {
//         throw new Error(`HTTP error! status: ${msg.status}`);
//       }
//       return msg.text();
//     })
//     .then((data) => {
//       try {
//         console.log('Received data:', data);
//         const jsonData = JSON.parse(data);
//         console.log(jsonData);
//       } catch (e) {
//         console.log('Received data is not valid JSON:', data);
//       }
//     })
//     .catch((error) => {
//       console.log('There was an error:', error);
//     });
// }

// loadBackend();