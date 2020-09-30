const io = require('socket.io')(3000)

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    const newUser = {
      name: name,
      id: socket.id
    }
    users[socket.id] = newUser

    const listUser = {
      newAddedUser: users[socket.id],
      listAllUser: users
    }
    socket.broadcast.emit('user-connected', listUser)
    socket.emit('initial-list', listUser)
  })

  socket.on('send-chat-message', data => {
    const message = data.message
    const destination = data.destination
    if (destination == "all") {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id].name })
    } else {
      io.to(destination).emit('chat-message', { message: message, name: users[socket.id].name })
    }
  })
  
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id].name)
    delete users[socket.id]
    const listUser = {
      listAllUser: users
    }
    socket.broadcast.emit('initial-list', listUser)
  })
})