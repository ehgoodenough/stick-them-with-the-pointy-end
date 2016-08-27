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

        // For collision
        this.radius = 16
    }
    update(delta) {
        
        if(Geometry.getMagnitude(this.position, this.game.hero.position) < this.radius + this.game.hero.radius) {
            console.log("COLLISION!!")
        }
    }
}
