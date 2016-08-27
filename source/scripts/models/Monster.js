import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"
import Tile from "scripts/models/Tile.js"

import config from "config.js"

var MONSTER_TEXTURE = Pixi.Texture.fromImage(require("images/monster1.png"))
var MAXIMUM_VELOCITY = .5

export default class Monster extends Pixi.Sprite {

    constructor(spawnPositionX, spawnPositionY) {
        super(MONSTER_TEXTURE)
        this.spawnPosition = {x: spawnPositionX, y: spawnPositionY}
        this.position.x = this.spawnPosition.x * config.tile.size
        this.position.y = this.spawnPosition.y * config.tile.size
        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.velocity = new Pixi.Point(0, 0)
        this.targetPosition = {x: this.position.x, y: this.position.y}

        // For collision
        this.radius = 16
        this.attackDamage = 1

    }
    update(){
        this.theHero = this.parent.parent.hero
        var positionRelativeToHeroX = this.theHero.position.x - this.position.x
        var positionRelativeToHeroY = this.theHero.position.y - this.position.y
        this.rotation = Geometry.getAngle(positionRelativeToHeroX, positionRelativeToHeroY)
        var magnitudeOfRelativePosition = Geometry.getMagnitude(positionRelativeToHeroX, positionRelativeToHeroY)
        this.velocity.x = positionRelativeToHeroX/magnitudeOfRelativePosition || 0
        this.velocity.y = positionRelativeToHeroY/magnitudeOfRelativePosition || 0
        // this.targetPosition.x += this.velocity.x
        // this.targetPosition.y += this.velocity.y

        //Max velocity check
        var magnitudeOfVelocity = Geometry.getMagnitude(this.velocity.x, this.velocity.y)
        if(magnitudeOfVelocity > MAXIMUM_VELOCITY){
            this.velocity.x *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
            this.velocity.y *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
        }

        // Collide with tiles
        this.game.tiles.children.forEach((child) => {
            if(child instanceof Tile) {
                var tile = child
                if(tile.containsPoint({
                    x: this.position.x + this.velocity.x,
                    y: this.position.y
                })) {
                    this.velocity.x = 0
                }
                if(tile.containsPoint({
                    x: this.position.x,
                    y: this.position.y + this.velocity.y
                })) {
                    this.velocity.y = 0
                }
            }
        })

        //Collision detection with Hero
        if(Geometry.getDistance(this.position, this.game.hero.position) < this.radius + this.game.hero.radius) {
            this.game.hero.beAttacked({
                velocity: this.velocity,
                damage: this.attackDamage,
            })
            //this.velocity = {x: 0, y: 0}
        }

        //Translation
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    beAttacked(){
        console.log("blegh")
    }
}
