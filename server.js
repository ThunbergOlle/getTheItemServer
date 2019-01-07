var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(80);

let activePlayers = [];


io.of("/lobby").on("connection", socket => {
  console.log("A new player connected to the index page.");

  socket.on("gameRoom", function(data) {
    let username = data.username;
    activePlayers.push({
      username: username,
      color: "color(255, 204, 0)",
      isAdmin: false,
      x: 0,
      y: 0
    });
  });
});
io.of("/game").on("connection", socket => {
  console.log("Someone connected to the game");
  socket.on("sendMyPosition", data => {
    if (activePlayers !== []) {
      for (let i = 0; i < activePlayers.length; i++) {
        if (activePlayers[i].username === data.username) {
          activePlayers[i].x = data.x;
          activePlayers[i].y = data.y;
        }
      }
    }
  });

  emitPlayers = () => {
    setTimeout(emitPlayers, 200);
    socket.emit("allPlayers", { activePlayers });
  };
  emitPlayers();
});
