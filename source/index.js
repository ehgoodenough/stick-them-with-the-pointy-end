///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

import Pixi from "pixi.js"
import Afloop from "afloop"

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

var WIDTH = 160, HEIGHT = 90
var TILE_SIZE = 16

var renderer = new Pixi.CanvasRenderer(WIDTH, HEIGHT)
renderer.backgroundColor = 0x222222
renderer.roundPixels = true

document.body.appendChild(renderer.view)

////////////////////////////////////////
///// Establishing the Game State /////
//////////////////////////////////////

import Hero from "scripts/Hero.js"

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

var hero = new Hero()
game.addChild(hero)

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

var loop = Afloop(function(delta) {
    delta = delta / (1000 / 60)

    hero.update(delta)

    renderer.render(game)
})
