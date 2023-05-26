import  {Scene} from "phaser";
import json from './Assets/map.json'
import mapimage from './Assets/19.07a Gentle Forest 3.0 ($5 palettes)/48x48 resize/gentle forest (48x48 resize) v05.png'
import tree from './Assets/tree.png'
import hero from './Assets/character.png'
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ?'https://onlinecommunity.onrender.com/' : 'http://localhost:3000';

const socket = io(URL);

console.log(json)
export default class TestScene extends Scene {
    constructor() {
        super('TestScene');
    }
    player
    map
    preload() {
        this.load.image('map image',mapimage)
        this.load.tilemapTiledJSON('map data',json)
        this.load.spritesheet('hero',hero,{frameWidth:16,frameHeight:32})
        // this.load.spritesheet('tree',tree,{frameWidth:103,frameHeight:123})
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
    console.log(this.map,"map")
    let tileset=this.map.addTilesetImage('gentle forest (48x48 resize) v05','map image')
    console.log(tileset,"tileset")
    this.baselayer=this.map.createLayer("Tile Layer 1", tileset,0,0).setScale(0.5);
    this.clifflayer=this.map.createLayer("cliffs", tileset,0,0).setScale(0.5);
    this.clifflayer.setCollisionByExclusion(-1)
    // this.clifflayer.renderDebug(this.add.graphics());

    // map.createFromObjects("Trees", {gid:208,key:'tree'});
    this.player=this.physics.add.sprite(0,0,'hero')
    console.log(this.clifflayer,this.player)

    // this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, this.clifflayer, () => {
            console.log('colliding');
        });
    this.cameras.main.startFollow(this.player,true,1,1)
    this.cameras.main.setFollowOffset(0,-this.player.height)

    socket.emit('player joining', json.stringify({"name":"Jim"}))
    function sendstate(){
      let playerdata = {
          "offsetx": this.player.x,
          "offsety": this.player.y,
          "id":this.player.id
              }
      socket.emit('returning state', json.stringify(playerdata))
    }

    setInterval(sendstate, 250)

    socket.on('updateState',(data)=>{
      // let tempplayers=json.parse(data)
      // for (let player of tempplayers){
      //   if (player['id']==app.player.id){
      //     continue
      //   }
      //   if (player['id'] not in app.playernames){
      //     this.playernames.append(player['id'])
      //     let pos = [player['x'],player['y']]
      //     newplayer=AnotherPlayerEntity(app, name='kitty', pos=pos, player['id'])
      //     this.players.append(newplayer)
      //   }
      //   for (let play in this.players){
      //     if (play.playername==player['id']){
      //         play.lastpos=play.pos
      //         play.currentpos=vec2(int(player['x']),int(player['y']))
      //         play.pos=vec2(int(player['x']),int(player['y']))
      //         play.incrementx=play.currentpos[0]-play.lastpos[0]
      //         play.incrementx=int(play.incrementx/15)
      //         play.incrementy=play.currentpos[1]-play.lastpos[1]
      //         play.incrementy=int(play.incrementy/15)
      //         play.positiontimer=0
      //         play.angle=player['angle']
      //     }
      //   }
      // }
    })
  }
  update(){
    const cursors=this.input.keyboard.createCursorKeys()
    this.player.setVelocity(0);

    if(cursors.left.isDown){
      this.player.setVelocityX(-200);
    }else if(cursors.right.isDown){
      this.player.setVelocityX(200);
    }else if(cursors.up.isDown){
      this.player.setVelocityY(-200);
    }else if(cursors.down.isDown){
      this.player.setVelocityY(200);
    }
  }
}
