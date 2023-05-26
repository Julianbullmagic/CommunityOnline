const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const usersRouter = require("./routes/api/users");
const config = require('config');
const cors = require('cors');
const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);
require('dotenv').config()
const app = express();
const server = http.createServer(app);
const io = new Server(server);
// Body parser middleware
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(cors({
    origin: '*'
}));
// DB Config
const db = process.env.MONGO_URI
// Connect to MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", usersRouter);
//
// //Serve static assets if in production
// if (process.env.NODE_ENV = "production") {
//     app.use(express.static('client/build'));
//
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }
setInterval(sendState, 500)


function sendState(){
  console.log("returning state",players)
  io.emit('updateState',JSON.stringify(players))
}

let players=[]
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let playerid=""
  socket.on('player joining', (data) => {
    let parseddata=JSON.parse(data)
    playerid=parseddata.name
    players.push({id:parseddata.name,x:0,y:0,angle:0})
  });
socket.on('disconnect', () => {
  console.log('user disconnected');
});
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
socket.on('returning state', (data) => {
  let parseddata=JSON.parse(data)
  for (let player of players){
    if(parseddata.id==player.id){
      player.x=parseddata.offsetx
      player.y=parseddata.offsety
      player.angle=parseddata.angle
    }
  }
});
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
