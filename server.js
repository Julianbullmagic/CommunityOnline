const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const usersRouter = require("./routes/api/users");
const config = require('config');
const cors = require('cors');
const { Server } = require("socket.io");
require('dotenv').config()
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http,{
  cors: {
    origin: ['https://onlinecommunity.onrender.com' , 'http://localhost:3000'],
    methods: ["GET", "POST"]
  }
});
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
    let nametaken=false
    for (let player of players){
      if (player.id==playerid){
      nametaken=true
    }
  }
    if(!nametaken){
      players.push({id:parseddata.name,x:parseddata.name.x,y:parseddata.y})
    }
  });
  socket.on('logout', (name) => {
    console.log(`${name} logging out`);
    let newplayers=[]
    for (let player of players){
      if (player.id!==name){
      newplayers.push(player)
    }
  }
    players=newplayers
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
      player.x=parseddata.x
      player.y=parseddata.y
    }
  }
  io.emit("updateState",JSON.stringify(players))
});
});


const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));
