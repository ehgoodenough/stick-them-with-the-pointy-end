import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"
import Sound from "scripts/utility/Sound.js"
import Tile from "scripts/models/Tile.js"

import config from "config.js"

var MONSTER_TEXTURE = Pixi.Texture.fromImage(require("images/monster1.png"))
var SPAWNER_TEXTURE = Pixi.Texture.fromImage(require("images/white.png"))
var SPLAT_SOUND = new Sound([require("sounds/splat1.mp3"), require("sounds/splat2.mp3"), require("sounds/splat3.mp3"), require("sounds/splat4.mp3")])
var HIT_SOUND = new Sound(require("sounds/hit.mp3"))
var WHOOSH_SOUND = new Sound(require("sounds/whoosh.mp3"))
var STUTTER = 12

var BLOOD_TEXTURES = [
    Pixi.Texture.fromImage(require("images/blood1.png")),
    Pixi.Texture.fromImage(require("images/blood2.png")),
    Pixi.Texture.fromImage(require("images/blood3.png")),
    Pixi.Texture.fromImage(require("images/blood4.png")),
    Pixi.Texture.fromImage(require("images/blood5.png")),
]

// Used for win condition
var spawnerCount = 0

export default class Monster extends Pixi.Sprite {
    constructor(monster) {
        super(MONSTER_TEXTURE)
        this.spawnposition = {tx: monster.tx, ty: monster.ty}

        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (this.spawnposition.tx + this.anchor.x) * config.tile.size
        this.position.y = (this.spawnposition.ty + this.anchor.y) * config.tile.size

        this.spawnhealth = 2
        this.health = this.spawnhealth
        this.attack = {
            damage: 1, // halfhearts
            cooldown: 1.5 // seconds
        }

        this.scale.x = 1
        this.scale.y = 1
        this.maxvelocity = 0.5

        this.rank = monster.rank

        if(this.rank == "grunt") {
            this.maxvelocity = 1
            this.scale.x = 0.5
            this.scale.y = 0.5
            this.attack.damage = 1
            this.health = 1
            this.spawnhealth = this.health
        } else if(this.rank == "warrior") {
            this.maxvelocity = 0.5
            this.scale.x = 0.8
            this.scale.y = 0.8
            this.attack.damage = 1
            this.health = 1
            this.spawnhealth = this.health
        } else if(this.rank == "tank") {
            this.maxvelocity = 0.5
            this.scale.x = 1.25
            this.scale.y = 1.25
            this.attack.damage = 1
            this.health = 2
            this.spawnhealth = this.health
        } else if(this.rank == "elite") {
            this.maxvelocity = 0.5
            this.scale.x = 2.2
            this.scale.y = 2.2
            this.attack.damage = 2
            this.health = 3
            this.spawnhealth = this.health
        } else if(this.rank == "spawner") {
            this.scale.x = 2
            this.scale.y = 2
            this.health = 5
            this.spawnhealth = this.health
            this.texture = SPAWNER_TEXTURE
            spawnerCount += 1
        }

        this.velocity = new Pixi.Point(0, 0)
        this.targetPosition = {x: this.position.x, y: this.position.y}

        // For collision
        this.radius = 16 * (this.scale.x|| 1)

        this.isAngered = false
        this.isDead = false

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

        this.kickbackCooldown = 0
    }
    update(delta) {
        if(this.game.hero.mode == "GAME MODE") {
            if(this.isAngered == true && this.isDead != true) {
                if(this.rank == "spawner") {
                    //
                } else {
                    var positionRelativeToHeroX = this.game.hero.position.x - this.position.x
                    var positionRelativeToHeroY = this.game.hero.position.y - this.position.y
                    var magnitudeOfRelativePosition = Geometry.getMagnitude(positionRelativeToHeroX, positionRelativeToHeroY)
                    var velocityUnitVector = {x: positionRelativeToHeroX/magnitudeOfRelativePosition || 0, y: positionRelativeToHeroY/magnitudeOfRelativePosition || 0}
                    if(!this.isReadyToPounce && !this.isPouncing && !this.isCoolingDown && this.kickbackCooldown <= 0 && !this.isStunned) {
                        // Set velocity toward hero
                        this.rotation = Geometry.getAngle(positionRelativeToHeroX, positionRelativeToHeroY)
                        this.velocity.x = velocityUnitVector.x * this.maxvelocity
                        this.velocity.y = velocityUnitVector.y * this.maxvelocity

                        // Max velocity check
                        var magnitudeOfVelocity = Geometry.getMagnitude(this.velocity.x, this.velocity.y)
                        if(magnitudeOfVelocity > this.maxvelocity){
                            this.velocity.x *= (1/magnitudeOfVelocity)*this.maxvelocity
                            this.velocity.y *= (1/magnitudeOfVelocity)*this.maxvelocity
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

                    // Collision detection with Hero
                    if(!this.isStunned) {
                        if(!this.isReadyToPounce && !this.isCoolingDown) {
                            var heroRadiusForCollision = this.game.hero.radius * 0.6
                            var distanceToHero = Geometry.getDistance(this.position, this.game.hero.position)
                            if(distanceToHero < this.radius + heroRadiusForCollision * 4) {
                                if(!this.isPouncing && !this.isCoolingDown && this.kickbackCooldown <= 0 && !this.isStunned) {
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
                    }

                    // Stuttering effect
                    if(!this.isReadyToPounce && !this.isPouncing && !this.isCoolingDown) {
                        this.rotation += (Math.random() * (Math.PI / STUTTER)) - (Math.PI / (STUTTER * 2))
                    }

                    // Translation
                    this.position.x += this.velocity.x
                    this.position.y += this.velocity.y

                    // Update timers
                    if(this.kickbackCooldown <= 0 && !this.isStunned) {
                        if(this.timeSincePounceStartup < this.pounceStartup) {
                            this.timeSincePounceStartup += delta.s
                        } else if(this.isReadyToPounce){
                            this.pounce()
                        }
                        if(this.timeSincePounce < this.pounceDuration) {
                            this.timeSincePounce += delta.s
                        } else if(this.isPouncing) {
                            this.beginCooldown()
                        }
                        if(this.timeSincePounceCooldown < this.pounceCooldown) {
                            this.timeSincePounceCooldown += delta.s
                        } else if(this.isCoolingDown) {
                            this.finishCooldown()
                        }
                    }
                    if(this.kickbackCooldown > 0) {
                        this.kickbackCooldown -= delta.s
                        if(this.kickbackCooldown <= 0) {
                            this.velocity.x = 0
                            this.velocity.y = 0
                        }
                    }
                }
            } else {
                if((this.position.x > -1 * this.game.position.x - config.tile.size)
                && (this.position.y > -1 * this.game.position.y - config.tile.size)
                && (this.position.x < -1 * this.game.position.x + config.frame.width + config.tile.size)
                && (this.position.y < -1 * this.game.position.y + config.frame.height + config.tile.size)) {
                    this.isAngered = true
                }
            }
        }
    }
    beAttacked(attack) {
        this.velocity.x = Math.sin(-1 * (attack.direction || 0)) * (attack.force || 0)
        this.velocity.y = Math.cos(-1 * (attack.direction || 0)) * (attack.force || 0)
        this.kickbackCooldown = attack.kickbackCooldown || 0.05

        this.isStunned = attack.isStunned || false

        this.leavePounceStates()

        this.health -= attack.damage || 1
        if(this.health <= 0) {
            this.isDead = true
            if(this.rank == "spawner") {
                spawnerCount -= 1
            }

            SPLAT_SOUND.playSound()

            this.alpha = Math.random() * 0.5 + 0.5
            this.rotation = Math.random() * Math.PI * 2
            this.texture = BLOOD_TEXTURES[Math.floor(Math.random() * BLOOD_TEXTURES.length)]
        }else{
            HIT_SOUND.playSound()
        }
    }
    getReadyToPounce(pounceVector) {
        this.isReadyToPounce = true
        this.timeSincePounceStartup = 0

        this.pounceVector = pounceVector
        this.velocity = {x: 0, y: 0}
    }
    pounce() {
        WHOOSH_SOUND.playSound()
        this.timeSincePounce = 0
        this.isReadyToPounce = false
        this.isPouncing = true

        this.velocity = {x: this.pounceVector.x*this.pounceForce, y: this.pounceVector.y*this.pounceForce}
    }
    beginCooldown() {
        this.isPouncing = false
        this.timeSincePounceCooldown = 0
        this.velocity = {x: 0, y:0}
        this.isCoolingDown = true
    }
    finishCooldown() {
        this.isCoolingDown = false
    }
    leavePounceStates() {
        this.isReadyToPounce = false
        this.isPouncing = false
        this.isCoolingDown = false
    }
    get tint() {
        if((this.isReadyToPounce || this.isPouncing)
        && this.isStunned != true) {
            return 0xCC8800
        } else{
            return 0xFFFFFF
        }
    }
    get data() {
        return {
            rank: this.rank,
            tx: this.spawnposition.tx,
            ty: this.spawnposition.ty,
            // attack: this.attack,
            // health: this.health,
            // scale: this.scale.x
        }
    }
    containsPoint(point) {
        return Geometry.getDistance(this.position, point) < this.radius
    }
    reset() {
        if(this.rank == "spawner" && this.isDead == true) {
            spawnerCount += 1
        }

        this.health = this.spawnhealth

        this.isAngered = false
        this.isDead = false

        this.leavePounceStates()
        this.kickbackCooldown = 0
        this.alpha = 1

        if(this.rank == "spawner") {
            this.texture = SPAWNER_TEXTURE
        } else {
            this.texture = MONSTER_TEXTURE
        }

        this.position.x = (this.spawnposition.tx + this.anchor.x) * config.tile.size
        this.position.y = (this.spawnposition.ty + this.anchor.y) * config.tile.size
    }
    get order() {
        if(this.isDead == true) {
            return 1
        } else {
            return 2
        }
    }
    static get spawnerCount() {
        return spawnerCount
    }
    static decreaseSpawnerCount() {
        spawnerCount -= 1
    }
}
