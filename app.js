const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const PORT = config.get("port") || 3000;
const app = express();
const medCentersRoutes = require("./routes/medCenters.routes");
const doctorsRoutes = require("./routes/doctors.routes");
const registrationRoutes = require("./routes/registration.routes");
const authorizationRoutes = require("./routes/auth.routes");
const userAuthRoutes = require("./routes/userAuth.routes");
const profileRoutes = require("./routes/profile.routes");
const ACTIONS = require("./socket/actions");
const { version, validate } = require("uuid");

const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);
// const io = require("socket.io")(server);

const io = new socket.Server(server, {
  cors: {
    origin: config.get("clientUrl"),
    credentials: true,
  },
});

function getClientRooms() {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter(
    (roomID) => validate(roomID) && version(roomID) === 4
  );
}

function shareRoomsInfo() {
  io.emit(ACTIONS.SHARE_ROOMS, { rooms: getClientRooms() });
}

io.on("connection", (socket) => {
  shareRoomsInfo();

  socket.on(ACTIONS.JOIN, (config) => {
    const { room: roomID } = config;
    const { rooms: joinedRooms } = socket;

    if (Array.from(joinedRooms).includes(roomID)) {
      return console.warn(`Already joined to ${roomID}`);
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    clients.forEach((clientID) => {
      io.to(clientID).emit(ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerID: clientID,
        createOffer: true,
      });
    });

    socket.join(roomID);
    shareRoomsInfo();
  });

  function leaveRoom() {
    const { rooms } = socket;

    Array.from(rooms)
      // LEAVE ONLY CLIENT CREATED ROOM
      .filter((roomID) => validate(roomID) && version(roomID) === 4)
      .forEach((roomID) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        clients.forEach((clientID) => {
          io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
            peerID: socket.id,
          });

          socket.emit(ACTIONS.REMOVE_PEER, {
            peerID: clientID,
          });
        });

        socket.leave(roomID);
      });

    shareRoomsInfo();
  }

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);

  socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
    io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerID: socket.id,
      sessionDescription,
    });
  });

  socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
    io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
      peerID: socket.id,
      iceCandidate,
    });
  });
});

app.use(
  cors({
    origin: config.get("clientUrl"),
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/medCenters", medCentersRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/registration", registrationRoutes);
app.use("/authorization", authorizationRoutes);
app.use("/userAuth", userAuthRoutes);
app.use("/profile", profileRoutes);

start = async () => {
  try {
    await mongoose.connect(config.get("mongoUrl"));
    server.listen(PORT, () => {
      console.log(`Server has been started on port: ${PORT}...`);
    });
  } catch (e) {
    console.log("Server error, error message:", e.message);
    process.exit(1);
  }
};

start();
