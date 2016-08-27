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
        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }
    update(){
        var positionRelativeToHero = {x: 0, y: 0}
        var theHero = this.parent.parent.hero
        positionRelativeToHero.x = theHero.position.x - this.position.x
        positionRelativeToHero.y = theHero.position.y - this.position.y
        this.rotation = Geometry.getAngle(positionRelativeToHero.x, positionRelativeToHero.y)
    }
}
