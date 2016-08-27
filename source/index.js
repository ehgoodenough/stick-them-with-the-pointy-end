///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

import Pixi from "pixi.js"
import Afloop from "afloop"
import Keyb from "keyb"

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

var WIDTH = 160, HEIGHT = 90
var GAMEPAD_THRESHOLD = 0.05
var TILE_SIZE = 16

var renderer = new Pixi.CanvasRenderer(WIDTH, HEIGHT)
renderer.backgroundColor = 0x222222
renderer.roundPixels = true

document.body.appendChild(renderer.view)

////////////////////////////////////////
///// Establishing the Game State /////
//////////////////////////////////////

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.png"))

class Hero extends Pixi.Sprite {
    constructor(image) {
        super(image)

        this.position.x = WIDTH * 0.15
        this.position.y = HEIGHT * 0.5
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
        if(Keyb.isDown("<up>")) {
            this.velocity.y = this.maxVelocity * -1 * delta
        } if(Keyb.isDown("<down>")) {
            this.velocity.y = this.maxVelocity * delta
        } if(Keyb.isDown("<left>")) {
            this.velocity.x = this.maxVelocity * -1 * delta
        } if(Keyb.isDown("<right>")) {
            this.velocity.x = this.maxVelocity * delta
        }

        // Collide with tiles
        this.parent.children.forEach((child) => {
            if(child instanceof Tile) {
                var tile = child
                tile.hasPoint(this.position)
                // if(tile.hasPoint({
                //     x: this.position.x + this.velocity.x,
                //     y: this.position.y
                // })) {
                //     this.velocity.x = 0
                // }
                // if(tile.hasPoint({
                //     x: this.position.x + this.velocity.x,
                //     y: this.position.y + this.velocity.y
                // })) {
                //     this.velocity.y = 0
                // }
            }
        })

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.velocity.y *= (1 / this.friction)
        this.velocity.x *= (1 / this.friction)

        var gamepads = navigator.getGamepads()
        if(gamepads[0] != undefined) {
            var x = gamepads[0].axes[0]
            var y = gamepads[0].axes[1]

            var magnitude = Math.sqrt(x*x + y*y)
            if(magnitude > GAMEPAD_THRESHOLD) {
                this.rotation
            }
        }
    }
}

function getDistance(p1, p2) {
    var x = p1.x - p2.x
    var y = p1.y - p2.y

    return Math.sqrt((x * x) + (y * y))
}

var WALL_TEXTURE = Pixi.Texture.fromImage(require("images/wall1.png"))

class Tile extends Pixi.Sprite {
    constructor(tile) {
        super(WALL_TEXTURE)
        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (tile.tx + this.anchor.x) * TILE_SIZE
        this.position.y = (tile.ty + this.anchor.y) * TILE_SIZE

        // I'm only scaling down the
        // tiles because the image that
        // I've imported is waaay too big.
        this.scale.x /= 4
        this.scale.y /= 4

        // Used for collision
        this.radius = 8
    }
    hasPoint(point) {
        return point.x > this.position.x - this.radius
            && point.x < this.position.x + this.radius
            && point.y > this.position.y - this.radius
            && point.y < this.position.y - this.radius
    }
}

var game = new Pixi.Container()

game.addChild(new Tile({tx: 0, ty: 0}))
// game.addChild(new Tile({tx: 1, ty: 0}))
// game.addChild(new Tile({tx: 0, ty: 1}))

var hero = new Hero(HERO_TEXTURE)
game.addChild(hero)

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

var loop = Afloop(function(delta) {
    delta = delta / (1000 / 60)

    hero.update(delta)

    renderer.render(game)
})
