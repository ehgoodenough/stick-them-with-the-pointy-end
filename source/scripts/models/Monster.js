import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"
import Tile from "scripts/models/Tile.js"

import config from "config.js"

var MONSTER_TEXTURE = Pixi.Texture.fromImage(require("images/monster1.png"))
var MAXIMUM_VELOCITY = .5
var STUTTER = 12

export default class Monster extends Pixi.Sprite {

    constructor(monster) {
        super(MONSTER_TEXTURE)
        this.spawnposition = {tx: monster.tx, ty: monster.ty}

        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (this.spawnposition.tx + this.anchor.x) * config.tile.size
        this.position.y = (this.spawnposition.ty + this.anchor.y) * config.tile.size

        this.velocity = new Pixi.Point(0, 0)
        this.targetPosition = {x: this.position.x, y: this.position.y}

        // For collision
        this.radius = 16

        this.spawnhealth = monster.health || 2
        this.health = this.spawnhealth
        this.attack = {
            damage: monster.attack && monster.attack.damage || 1, // halfhearts
            cooldown: monster.attack && monster.attack.cooldown || 1.5 // seconds
        }

        this.isAngered = false
        this.IsDead = false
    }
    update(delta) {
        if(this.game.hero.mode == "GAME MODE") {
            if(this.isAngered == true && this.IsDead != true) {
                // var positionRelativeToHeroX = this.game.hero.position.x - this.position.x
                // var positionRelativeToHeroY = this.game.hero.position.y - this.position.y
                // this.rotation = Geometry.getAngle(positionRelativeToHeroX, positionRelativeToHeroY)
                // var magnitudeOfRelativePosition = Geometry.getMagnitude(positionRelativeToHeroX, positionRelativeToHeroY)
                // this.velocity.x = positionRelativeToHeroX/magnitudeOfRelativePosition || 0
                // this.velocity.y = positionRelativeToHeroY/magnitudeOfRelativePosition || 0
                //
                // //Max velocity check
                // var magnitudeOfVelocity = Geometry.getMagnitude(this.velocity.x, this.velocity.y)
                // if(magnitudeOfVelocity > MAXIMUM_VELOCITY){
                //     this.velocity.x *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
                //     this.velocity.y *= (1/magnitudeOfVelocity)*MAXIMUM_VELOCITY
                // }

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
                this.rotation += (Math.random() * (Math.PI / STUTTER)) - (Math.PI / (STUTTER * 2))

                // Translation
                this.position.x += this.velocity.x
                this.position.y += this.velocity.y
            } else {
                if((this.position.x > -1 * this.game.position.x - config.tile.size)
                && (this.position.y > -1 * this.game.position.y - config.tile.size)
                && (this.position.x < -1 * this.game.position.x + config.frame.width + config.tile.size)
                && (this.position.y < -1 * this.game.position.y + config.frame.height + config.tile.size)) {
                    this.isAngered = true
                }
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
    beAttacked(attack) {
        this.velocity.x = Math.sin(-1 * attack.direction) * attack.force
        this.velocity.y = Math.cos(-1 * attack.direction) * attack.force
        this.kickbackCooldown = 0.05

        this.health -= attack.damage || 1
        if(this.health <= 0) {
            this.IsDead = true
        }
    }
    get visible() {
        return this.IsDead != true
    }
    get data() {
        return {
            tx: this.spawnposition.tx,
            ty: this.spawnposition.ty,
            attack: this.attack,
            health: this.health
        }
    }
    containsPoint(point) {
        return Geometry.getDistance(this.position, point) < this.radius
    }
    reset() {
        this.health = this.spawnhealth

        this.isAngered = false
        this.IsDead = false

        this.position.x = (this.spawnposition.tx + this.anchor.x) * config.tile.size
        this.position.y = (this.spawnposition.ty + this.anchor.y) * config.tile.size
    }
}
