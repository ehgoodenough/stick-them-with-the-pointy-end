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
        this.velocity = new Pixi.Point(0, 0)
        this.targetPosition = {x: this.position.x, y: this.position.y}
    }
    update(){
        this.theHero = this.parent.parent.hero
        var positionRelativeToHeroX = this.theHero.position.x - this.position.x
        var positionRelativeToHeroY = this.theHero.position.y - this.position.y
        this.rotation = Geometry.getAngle(positionRelativeToHeroX, positionRelativeToHeroY)
        var magnitudeOfRelativePosition = Geometry.getMagnitude(positionRelativeToHeroX, positionRelativeToHeroY)
        var velocity = {x: positionRelativeToHeroX/magnitudeOfRelativePosition, y: positionRelativeToHeroY/magnitudeOfRelativePosition}
        this.targetPosition.x += velocity.x
        this.targetPosition.y += velocity.y

        //Max velocity check
        var magnitudeOfVelocity = Geometry.getMagnitude(this.velocity.x, this.velocity.y)
        if(magnitudeOfVelocity > MAXIMUM_VELOCITY){
            this.velocity.x *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
            this.velocity.y *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
        }

        //Translation
        this.position.x += velocity.x
        this.position.y += velocity.y
    }
}
