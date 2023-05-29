import  {Scene} from "phaser";
import json from './Assets/map.json'
import mapimage from './Assets/19.07a Gentle Forest 3.0 ($5 palettes)/48x48 resize/gentle forest (48x48 resize) v05.png'
import tree from './Assets/tree.png'
import character from './Assets/charactersprite.png'
import hero from './Assets/character.png'
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ?'https://onlinecommunity.onrender.com' : 'http://localhost:5000';
console.log(URL,"connection url")
const socket = io(URL);


socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
console.log(process.env.NODE_ENV,URL)
console.log(json)


export default class TestScene extends Scene {

    constructor() {
        super('TestScene');
        this.playernames=[]
        this.incr=0
    }


    sendstate(x,y,id,moving,direction){
      let playerdata = {
          "x": Math.round(x),
          "y": Math.round(y),
          "id":id,
          "moving":moving,
          "direction":direction
              }
      socket.emit('returning state', JSON.stringify(playerdata))
    }

    preload() {
        this.load.image('map image',mapimage)
        this.load.tilemapTiledJSON('map data',json)
        this.load.spritesheet('hero',hero,{frameWidth:16,frameHeight:32})
        this.load.spritesheet('character',character,{frameWidth:48,frameHeight:80})
    }

  create(){
 //Layer creation
   this.map = this.make.tilemap({
   key:'map data',
   width: 100,
   height: 100,
   tileWidth: 48,
   tileHeight: 48,
   });
    let tileset=this.map.addTilesetImage('gentle forest (48x48 resize) v05','map image')
    this.baselayer=this.map.createLayer("Tile Layer 1", tileset,0,0).setScale(0.5);
    this.clifflayer=this.map.createLayer("cliffs", tileset,0,0).setScale(0.5);
    this.clifflayer.setCollisionByExclusion(-1)
    // this.clifflayer.renderDebug(this.add.graphics());
    // map.createFromObjects("Trees", {gid:208,key:'tree'});
    this.player=this.physics.add.sprite(0,0,'character')
    this.anims.create({
    key: "up",
    frameRate: 10,
    frames: this.anims.generateFrameNumbers("character", { start: 15, end: 19 }),
    repeat: -1
});
this.anims.create({
key: "down",
frameRate: 10,
frames: this.anims.generateFrameNumbers("character", { start: 0, end: 4 }),
repeat: -1
});
this.anims.create({
key: "left",
frameRate: 10,
frames: this.anims.generateFrameNumbers("character", { start: 10, end: 14 }),
repeat: -1
});
this.anims.create({
key: "right",
frameRate: 10,
frames: this.anims.generateFrameNumbers("character", { start: 5, end: 9 }),
repeat: -1
});
    this.physics.add.collider(this.player, this.clifflayer);
    this.physics.world.setFPS(30)
    this.cameras.main.startFollow(this.player,true,1,1)
    this.cameras.main.setFollowOffset(0,-this.player.height)
    let name=localStorage.getItem("name")
    socket.emit('player joining', JSON.stringify({"name":name,"x":this.player.x,"y":this.player.y}))
    this.player.id=name

    // socket.on('updateState',(data)=>{
    //   console.log("updating global state",data)
    //   let tempplayers=JSON.parse(data)
    //   for (let player of tempplayers){
    //     if (player.id==this.player.id){
    //       continue
    //     }
    //     if (!this.playernames.includes(player['id'])){
    //       this.playernames.push(player['id'])
    //       let pos = [player['x'],player['y']]
    //       // newplayer=AnotherPlayerEntity(app, name='kitty', pos=pos, player['id'])
    //       // this.players.append(newplayer)
    //     }
    //     // for (let play in this.players){
    //     //   if (play.playername==player['id']){
    //     //       play.lastpos=play.pos
    //     //       play.currentpos=vec2(int(player['x']),int(player['y']))
    //     //       play.pos=vec2(int(player['x']),int(player['y']))
    //     //       play.incrementx=play.currentpos[0]-play.lastpos[0]
    //     //       play.incrementx=int(play.incrementx/15)
    //     //       play.incrementy=play.currentpos[1]-play.lastpos[1]
    //     //       play.incrementy=int(play.incrementy/15)
    //     //       play.positiontimer=0
    //     //       play.angle=player['angle']
    //     //   }
    //     // }
    //   }
    // })
  }
  update(){
    this.incr+=1
    let x=this.player.x
    let y=this.player.y
    let id=this.player.id
    // console.log(x,y,id)
    const cursors=this.input.keyboard.createCursorKeys()
    let moving=false
    let direction="still"
    this.player.setVelocity(0);
    if(cursors.left.isDown){
      this.player.anims.play('left',true)
      this.player.setVelocityX(-200);
      moving=true
      direction="left"
    }else if(cursors.right.isDown){
      this.player.anims.play('right',true)
      this.player.setVelocityX(200);
      moving=true
      direction="right"
    }else if(cursors.up.isDown){
      this.player.anims.play('up', true)
      this.player.setVelocityY(-200);
      moving=true
      direction="up"
    }else if(cursors.down.isDown){
      this.player.anims.play('down',true)
      this.player.setVelocityY(200);
      moving=true
      direction="down"
    }
    if (this.player.body.velocity.x==0&&this.player.body.velocity.y==0) {
      this.player.setFrame(0)
     this.player.anims.stop();
    }
    if(this.incr>5){
      this.sendstate(x,y,id,moving,direction)
      this.incr=0
    }
  }
}
