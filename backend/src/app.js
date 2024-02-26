const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectToDB = require("./db/connectDB");
const paragraphs = require("./api/Quotable");
const GameModel = require("./models/game.model");
const path = require("path");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:8000"], // Update with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

let PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is listening to http://localhost:${PORT}`);
});

connectToDB();

io.on("connect", (socket) => {
  socket.on("userInput", async ({ userInput, gameId }) => {
    try {
      let game = await GameModel.findById(gameId);
      if (!game.isOpen && !game.isOver) {
        let player = game.players.find(
          (player) => player.socketId === socket.id
        );
        let word = game.words[player.currentWordIndex];
        if (word === userInput) {
          player.currentWordIndex++;
          if (player.currentWordIndex !== game.words.length) {
            game = await game.save();
            io.to(gameId).emit("updateGame", game);
          } else {
            let endTime = new Date().getTime();
            let { startTime } = game;
            player.WPM = calculateWPM(endTime, startTime, player);
            game = await game.save();
            socket.emit("done");
            io.to(gameId).emit("updateGame", game);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("create-game", async (nickName) => {
    try {
      let randomNumber = Math.floor(Math.random() * paragraphs?.length);
      paragraphs[randomNumber].split(" ");
      let quote = paragraphs[randomNumber].split(" ");
      if (quote?.length <= 0) {
        socket.emit("join-game-error", { error: "Something went wrong" });
        return;
      }
      let game = new GameModel();
      game.words = quote;
      let player = {
        socketId: socket.id,
        isPartyLeader: true,
        nickName,
      };
      game.players.push(player);
      game = await game.save();

      const gameId = game._id.toString();
      socket.join(gameId);
      io.to(gameId).emit("updateGame", game);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("join-game", async ({ gameId: _id, nickName }) => {
    try {
      let game = await GameModel.findById(_id);

      if (!game) {
        socket.emit("join-game-error", { error: "Game not found" });
        return;
      }
      if (game?.players.length > 3) {
        socket.emit("join-game-error", { error: "Slot full" });
        return;
      }

      if (game.isOpen) {
        let gameId = game._id.toString();
        socket.join(gameId);
        let player = {
          socketId: socket.id,
          nickName,
        };

        game.players.push(player);
        game = await game.save();
        io.to(gameId).emit("updateGame", game);
      } else {
        socket.emit("join-game-error", { error: "Game is not open" });
      }
    } catch (error) {
      socket.emit("join-game-error", { error: "Internal server error" });
    }
  });

  socket.on("timer", async ({ playerId, gameId }) => {
    try {
      let countDown = 5;
      let game = await GameModel.findById(gameId);
      let player = game.players.id(playerId);

      if (player.isPartyLeader) {
        let timerId = setInterval(async () => {
          if (countDown >= 0) {
            io.to(gameId).emit("timer", { countDown, msg: "Starting Game..." });
            countDown--;
          } else {
            game.isOpen = false;
            await game.save();
            io.to(gameId).emit("updateGame", game);
            startGameClock(gameId);
            clearInterval(timerId);
          }
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("eliminate-player", async ({ playerId, gameId }) => {
    try {
      let game = await GameModel.findById(gameId);
      if (!game) {
        socket.emit("join-game-error", { error: "Game not found" });
        return;
      }
      // Find the player to be eliminated
      let playerToEliminate = game.players.find((p) => p.socketId === playerId);
      if (!playerToEliminate) {
        // Player to eliminate not found, emit an error
        socket.emit("join-game-error", { error: "Player not found" });
        return;
      }
      // Check if the player trying to eliminate is the creator
      if (playerToEliminate.isPartyLeader) {
        socket.emit("join-game-error", {
          error: "Cannot eliminate the game creator",
        });
        return;
      }

      game.players = game.players.filter((p) => p.socketId !== playerId);
      game = await game.save();
      io.to(gameId).emit("updateGame", game);
      io.to(playerId).emit("elimination-success", {
        message: "You have been eliminated",
      });
    } catch (error) {
      socket.emit("join-game-error", { error: "Internal server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

async function startGameClock(gameId) {
  let game = await GameModel.findById(gameId);
  game.startTime = new Date().getTime();
  game = game.save();
  let time = 60;

  let timerId = setInterval(async function () {
    if (time >= 0) {
      let formattedTime = calculateTime(time);
      io.to(gameId).emit("timer", {
        countDown: formattedTime,
        msg: "Time Remaining",
      });
      time--;
    } else {
      clearInterval(timerId);
      let endTime = new Date().getTime();
      let game = await GameModel.findById(gameId);
      let { startTime } = game;
      game.isOver = true;
      game.players.forEach((player, index) => {
        if (player.WPM === -1)
          game.players[index].WPM = calculateWPM(endTime, startTime, player);
      });

      game = await game.save();
      io.to(gameId).emit("updateGame", game);
    }
  }, 1000);
}

function calculateTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  return `${minutes}:${seconds > 10 ? seconds : `0${seconds}`}`;
}
function calculateWPM(endTime, startTime, player) {
  let numOfWords = player.currentWordIndex;
  let timeInSeconds = (endTime - startTime) / 1000;
  let timeInMinutes = timeInSeconds / 60;
  let WPM = Math.floor(numOfWords / timeInMinutes);
  return WPM;
}
