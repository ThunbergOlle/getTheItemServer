var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(80);

let activePlayers = [];


io.of("/game").on("connection", (socket) => {
  console.log("Someone connected to the game");
  socket.on("sendMyPosition", (data) => {
    console.log(activePlayers);

    if (activePlayers !== []) {
      for (let i = 0; i < activePlayers.length; i++) {
        if (activePlayers[i].username === data.username) {
          activePlayers[i].x = data.x;
          activePlayers[i].y = data.y;
        }
      }
    }
  });
  socket.on("gameRoom", function(data) {
    let username = data.username;
    activePlayers.push({
      username: username,
      color: "color(255, 204, 0)",
      isAdmin: false,
      x: 0,
      y: 0,
      socketid: socket
    });
    console.log(activePlayers);
  });
  socket.on('disconnect', () => {
    var i = activePlayers.indexOf(socket);
    activePlayers.splice(i, 1);
  });

  emitPlayers = () => {
    setTimeout(emitPlayers, 200);
    socket.emit("allPlayers", { activePlayers });
  };
  emitPlayers();
});

