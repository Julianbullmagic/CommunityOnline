import {Scene} from "phaser"

export default class Preloader extends Scene{
  constructor(){
    super('preloader')
  }
  preload(){
    this.load.image('tiles','../../Assets/Overworld.png')
    this.load.tilemapTiledJSON('test','../../Assets/MMORPG.json')
    this.load.spritesheet('hero','../../Assets/character.png',{frameWidth:16,frameHeight:16})
  }
  create(){
    this.scene.start('testscene')
  }
}
