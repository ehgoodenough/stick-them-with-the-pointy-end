import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"
import Tile from "scripts/models/Tile.js"

import config from "config.js"

var MONSTER_TEXTURE = Pixi.Texture.fromImage(require("images/monster1.png"))
var MAXIMUM_VELOCITY = .5

export default class Monster extends Pixi.Sprite {

    constructor(monster) {
        super(MONSTER_TEXTURE)
        this.spawnPosition = {x: monster.tx, y: monster.ty}

        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (monster.tx + this.anchor.x) * config.tile.size
        this.position.y = (monster.ty + this.anchor.y) * config.tile.size

        this.velocity = new Pixi.Point(0, 0)
        this.targetPosition = {x: this.position.x, y: this.position.y}

        // For collision
        this.radius = 16

        this.attack = {
            damage: 1, // halfhearts
            cooldown: 1.5 // seconds
        }

        this.hasBeenAngered = false
        this.hasBeenKilled = false
    }
    update(delta) {
        if(this.game.hero.mode == "GAME MODE") {
            if(this.hasBeenAngered == true && this.hasBeenKilled != true) {
                var positionRelativeToHeroX = this.game.hero.position.x - this.position.x
                var positionRelativeToHeroY = this.game.hero.position.y - this.position.y
                this.rotation = Geometry.getAngle(positionRelativeToHeroX, positionRelativeToHeroY)
                var magnitudeOfRelativePosition = Geometry.getMagnitude(positionRelativeToHeroX, positionRelativeToHeroY)
                this.velocity.x = positionRelativeToHeroX/magnitudeOfRelativePosition || 0
                this.velocity.y = positionRelativeToHeroY/magnitudeOfRelativePosition || 0

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
                var heroRadiusForCollision = this.game.hero.radius
                heroRadiusForCollision *= .6
                if(Geometry.getDistance(this.position, this.game.hero.position) < this.radius + heroRadiusForCollision) {
                    this.game.hero.beAttacked({
                        damage: this.attack.damage,
                        cooldown: this.attack.cooldown,
                    })
                    this.velocity = {x: 0, y: 0}
                }

                // Stuttering effect
                var STUTTER = 12
                this.rotation += (Math.random() * (Math.PI / STUTTER)) - (Math.PI / (STUTTER * 2))

                //Translation
                this.position.x += this.velocity.x
                this.position.y += this.velocity.y
            } else {
                if((this.position.x > -1 * this.game.position.x - config.tile.size)
                && (this.position.y > -1 * this.game.position.y - config.tile.size)
                && (this.position.x < -1 * this.game.position.x + config.frame.width + config.tile.size)
                && (this.position.y < -1 * this.game.position.y + config.frame.height + config.tile.size)) {
                    this.hasBeenAngered = true
                }
            }
        }
    }
    beAttacked() {
        this.hasBeenKilled = true
    }
    get visible() {
        return this.hasBeenKilled != true
    }
    get data(){
        return {
            tx: this.spawnPosition.x,
            ty: this.spawnPosition.y
        }
    }
    containsPoint(point) {
        return Geometry.getDistance(this.position, point) < this.radius
    }
}
