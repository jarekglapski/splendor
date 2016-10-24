import socket from 'socket.io';

var registeredUser = null;
var clients = [];
var rooms = {};

function getRoom(roomId) {
  if (rooms[roomId]) {
    return rooms[roomId];
  } else {
    rooms[roomId] = {
      users: []
    };

    return rooms[roomId];
  }
}

export default function() {
  var io = socket.listen(4001);

  io.sockets.on('connection', function(socket) {
    socket.on('register_user', function(userId) {
      registeredUser = userId;
      clients.push(userId);

      io.emit('clients_list_updated', clients);
    });

    socket.on('disconnect', function() {
      clients.splice(clients.indexOf(registeredUser), 1);
      io.emit('clients_list_updated', clients);
    });

    socket.on('get_clients', function() {
      socket.emit('clients_list_updated', clients);
    });

    socket.on('connect_to_room', function(gameId) {
      var room = getRoom(gameId);

      socket.join(gameId);
      if (room.users.indexOf(registeredUser) >= 0) {
        console.log('[x]', registeredUser);
        return socket.emit('already_in_room', registeredUser);
      }
      room.users.push(registeredUser);

      io.to(gameId).emit('updated_room_players', clients, room.users);
      io.emit('clients_list_updated', clients);
    });

    socket.on('leave_room', function(gameId) {
      var room = getRoom(gameId);

      socket.leave(gameId);
      room.users.splice(room.users.indexOf(registeredUser), 1);
      io.to(gameId).emit('updated_room_players', clients, room.users);
      io.emit('clients_list_updated', clients);
    });
  });
};
