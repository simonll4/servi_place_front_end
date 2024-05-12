import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'


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


const userId1 = document.getElementById('inputname1');
const userId2 = document.getElementById('inputname2');
let num1
let num2

userId1.addEventListener('change', (e) => {
  num1 = e.target.value;
  console.log(num1);
});

userId2.addEventListener('change', (e) => {
  num2 = e.target.value;
  console.log(num2);
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const socket = io('http://localhost:5050');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('chat message', input.value, num1, num2);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});


const button = document.getElementById('myStyledButton');

button.addEventListener('click', () => {
  socket.emit('chat history', num1, num2);
});

// socket.on('set chat history', (msg) => {
//   console.log(msg);
//   const item = document.createElement('li');
//   item.textContent = msg;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });



socket.on('set chat history', (msgs) => {
  msgs.forEach(msg => {
    const item = document.createElement('li');
    item.textContent = msg.content; // Accede al campo 'content' de cada objeto
    messages.appendChild(item);
  });
  window.scrollTo(0, document.body.scrollHeight);
});
