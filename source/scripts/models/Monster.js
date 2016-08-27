import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"

var MONSTER_TEXTURE = Pixi.Texture.fromImage(require("images/monster1.png"))
var MAXIMUM_VELOCITY = 1
const TEXTURE_LENGTH = 32

export default class Monster extends Pixi.Sprite {

    constructor(spawnPositionX, spawnPositionY){
        super(MONSTER_TEXTURE)
        this.spawnPosition = {x: spawnPositionX, y: spawnPositionY}
        console.log(this.spawnPosition)
        this.position.x = this.spawnPosition.x * TEXTURE_LENGTH
        this.position.y = this.spawnPosition.y * TEXTURE_LENGTH
    }
    update(){

    }
}
