import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"

import config from "config.js"

var MONSTER_TEXTURE = Pixi.Texture.fromImage(require("images/monster1.png"))
var MAXIMUM_VELOCITY = 1

export default class Monster extends Pixi.Sprite {

    constructor(spawnPositionX, spawnPositionY) {
        super(MONSTER_TEXTURE)
        this.spawnPosition = {x: spawnPositionX, y: spawnPositionY}
        this.position.x = this.spawnPosition.x * config.tile.size
        this.position.y = this.spawnPosition.y * config.tile.size
        this.anchor.x = 0.5
        this.anchor.y = 0.5

        // For collision
        this.radius = 16
    }
    update(delta) {
        var positionRelativeToHero = {x: 0, y: 0}
        var theHero = this.parent.parent.hero
        positionRelativeToHero.x = theHero.position.x - this.position.x
        positionRelativeToHero.y = theHero.position.y - this.position.y
        this.rotation = Geometry.getAngle(positionRelativeToHero.x, positionRelativeToHero.y)


        if(Geometry.getDistance(this.position, this.game.hero.position) < this.radius + this.game.hero.radius) {
            console.log("COLLISION!!")
        }
    }
}
