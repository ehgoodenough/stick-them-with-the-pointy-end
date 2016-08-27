import Pixi from "pixi.js"
import Keyb from "keyb"

import Geometry from "scripts/Geometry.js"
import Tile from "scripts/Tile.js"
var GAMEPAD_THRESHOLD = 0.05

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.png"))

export default class Hero extends Pixi.Sprite {
    constructor() {
        super(HERO_TEXTURE)

        this.position.x = 32
        this.position.y = 32
        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.maxVelocity = .5
        this.velocity = new Pixi.Point(0,0)
        this.friction = 2

        // Used for collision
        this.radius = 8
    }
    update(delta) {
        // Poll inputs
        var gamepads = navigator.getGamepads()
        if(gamepads[0] != undefined) {
            var axes = gamepads[0].axes.slice()
            if(axes.length == 5){
                axes.shift()
            }
            var x = axes[0]
            var y = axes[1]

            var magnitude = Math.sqrt(x*x + y*y)
            if(magnitude > GAMEPAD_THRESHOLD) {
                this.rotation = Geometry.getAngle(x, y)
                this.velocity.y = y * this.maxVelocity * delta
                this.velocity.x = x * this.maxVelocity * delta
            }
        }

        if(Keyb.isDown("<up>")) {
            this.rotation = Math.PI
            this.velocity.y = this.maxVelocity * -1 * delta
        } if(Keyb.isDown("<down>")) {
            this.rotation = 0
            this.velocity.y = this.maxVelocity * delta
        } if(Keyb.isDown("<left>")) {
            this.rotation = Math.PI/2
            this.velocity.x = this.maxVelocity * -1 * delta
        } if(Keyb.isDown("<right>")) {
            this.rotation = 3/2 * Math.PI
            this.velocity.x = this.maxVelocity * delta
        }

        // Collide with tiles
        this.parent.children.forEach((child) => {
            if(child instanceof Tile) {
                var tile = child
                tile.containsPoint(this.position)
                if(tile.containsPoint({
                    x: this.position.x + this.velocity.x,
                    y: this.position.y
                })) {
                    this.velocity.x = 0
                }
                if(tile.containsPoint({
                    x: this.position.x + this.velocity.x,
                    y: this.position.y + this.velocity.y
                })) {
                    this.velocity.y = 0
                }
            }
        })

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.velocity.y *= (1 / this.friction)
        this.velocity.x *= (1 / this.friction)
    }
}
