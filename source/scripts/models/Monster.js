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

        this.isReadyToPounce = false
        this.isPouncing = false
        this.isCoolingDown = false
        this.pounceStartup = .7
        this.timeSincePounceStartup = this.pounceStartup
        this.pounceDuration = .3
        this.timeSincePounce = this.pounceDuration
        this.pounceCooldown = 1
        this.timeSincePounceCooldown = this.pounceCooldown
        this.pounceForce = 4
        this.pounceVector = {x:0, y:0}
    }
    update(delta) {
        if(this.game.hero.mode == "GAME MODE") {
            if(this.hasBeenAngered == true && this.hasBeenKilled != true) {
                if(!this.isReadyToPounce && !this.isPouncing && !this.isCoolingDown){
                    // Set velocity toward hero
                    var positionRelativeToHeroX = this.game.hero.position.x - this.position.x
                    var positionRelativeToHeroY = this.game.hero.position.y - this.position.y
                    this.rotation = Geometry.getAngle(positionRelativeToHeroX, positionRelativeToHeroY)
                    var magnitudeOfRelativePosition = Geometry.getMagnitude(positionRelativeToHeroX, positionRelativeToHeroY)
                    var velocityUnitVector = {x: positionRelativeToHeroX/magnitudeOfRelativePosition || 0, y: positionRelativeToHeroY/magnitudeOfRelativePosition || 0}
                    this.velocity.x = velocityUnitVector.x
                    this.velocity.y = velocityUnitVector.y

                    // Max velocity check
                    var magnitudeOfVelocity = Geometry.getMagnitude(this.velocity.x, this.velocity.y)
                    if(magnitudeOfVelocity > MAXIMUM_VELOCITY){
                        this.velocity.x *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
                        this.velocity.y *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
                    }
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

                if(!this.isReadyToPounce && !this.isCoolingDown){
                    // Collision detection with Hero
                    var heroRadiusForCollision = this.game.hero.radius
                    heroRadiusForCollision *= .6
                    var distanceToHero = Geometry.getDistance(this.position, this.game.hero.position)
                    if(distanceToHero < this.radius + heroRadiusForCollision*4) {
                        if(!this.isPouncing){
                            // Get ready to pounce
                            this.getReadyToPounce(velocityUnitVector)
                        }

                        if(distanceToHero < this.radius + heroRadiusForCollision) {
                            this.game.hero.beAttacked({
                                damage: this.attack.damage,
                                cooldown: this.attack.cooldown,
                            })
                            this.velocity = {x: 0, y: 0}
                        }
                    }
                }

                if(!this.isReadyToPounce){
                    // Stuttering effect
                    var STUTTER = 12
                    this.rotation += (Math.random() * (Math.PI / STUTTER)) - (Math.PI / (STUTTER * 2))
                }

                // Translation
                this.position.x += this.velocity.x
                this.position.y += this.velocity.y

                // Update timers
                if(this.timeSincePounceStartup < this.pounceStartup){
                    this.timeSincePounceStartup += delta.s
                } else if(this.isReadyToPounce){
                    this.pounce()
                }
                if(this.timeSincePounce < this.pounceDuration){
                    this.timeSincePounce += delta.s
                } else if(this.isPouncing){
                    this.beginCooldown()
                }
                if(this.timeSincePounceCooldown < this.pounceCooldown){
                    this.timeSincePounceCooldown += delta.s
                } else if(this.isCoolingDown){
                    this.finishCooldown()
                }

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
    getReadyToPounce(pounceVector) {
        this.isReadyToPounce = true
        this.timeSincePounceStartup = 0

        this.pounceVector = pounceVector
        this.velocity = {x: 0, y: 0}
    }
    pounce() {
        this.timeSincePounce = 0
        this.isReadyToPounce = false
        this.isPouncing = true

        this.velocity = {x: this.pounceVector.x*this.pounceForce, y: this.pounceVector.y*this.pounceForce}
    }
    beginCooldown(){
        this.isPouncing = false
        this.velocity = {x: 0, y:0}
        this.isCoolingDown = true
    }
    finishCooldown() {
        this.isCoolingDown = false
    }
    get tint(){
        if(this.isReadyToPounce || this.isPouncing){
            return 0xCC8800
        } else{
            return 0xFFFFFF
        }
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
