const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const listUser = document.getElementById('user')

const name = prompt('What is your name?')
appendMessage('You joined', true)
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', data => {
  const name = data.newAddedUser.name
  const id = data.newAddedUser.id
  appendMessage(`${name} connected`)

  //modify the select
  fillUserList(data.listAllUser);
})

socket.on('initial-list', data => {
  fillUserList(data.listAllUser);
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  let message = messageInput.value
  const destination = listUser.value
  const destinationName = listUser.options[listUser.selectedIndex].text
  if (destination != "all") {
    message = `(privately to ${destinationName}) ` + message
  }
  appendMessage(`You: ${message}`, true)
  socket.emit('send-chat-message', { message: message, destination: destination })
  messageInput.value = ''
})

function appendMessage(message, mychat = false) {
  let messageElement;
  messageElement = document.createElement('div')
  if (mychat) {
    messageElement.className = 'mychat'
  }
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function addUserList(name, id) {
  const listElement = document.createElement('option')
  listElement.innerText = name
  listElement.value = id
  listElement.id = id
  listUser.append(listElement)
}

function fillUserList(listOfUser) {
  const length = listUser.options.length;
  for (i = length - 1; i >= 1; i--) {
    listUser.options[i] = null;
  }
  console.log(listOfUser);
  for (const [key, value] of Object.entries(listOfUser)) {
    console.log(`This user have name ${value.name} and id ${value.id}`);
    addUserList(value.name, value.id)
  }
}