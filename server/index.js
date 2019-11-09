const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const _ = require("lodash");
const path = require("path");

const secret = require("./config/secret");

const app = express();

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

const { User } = require("./helpers/userClass");

// Routes
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

app.use(cors());

// Body Parser
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb"
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

mongoose.Promise = global.Promise;
mongoose.connect(secret.MongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

require("./socket/streams")(io);
require("./socket/private")(io, User, _);

app.use(cookieParser());

app.use("/api/chatapp", authRoutes);
app.use("/api/chatapp", postsRoutes);
app.use("/api/chatapp", usersRoutes);
app.use("/api/chatapp", notificationsRoutes);
app.use("/api/chatapp", messagesRoutes);

// Uncommit on deployment
app.use(express.static(path.resolve("dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

// Listening to the port
server.listen(process.env.PORT || 5500, err => {
  if (err) return err;
  console.log(`Node Started in ${process.env.NODE_ENV}`);
});
