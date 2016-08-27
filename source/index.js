///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

var Pixi = require("pixi.js")
var Afloop = require("afloop")
var Keyb = require("keyb")

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

var WIDTH = 160, HEIGHT = 90

var renderer = new Pixi.CanvasRenderer(WIDTH, HEIGHT)
renderer.backgroundColor = 0xEEEEEE
renderer.roundPixels = true

document.body.appendChild(renderer.view)

////////////////////////////////////////
///// Establishing the Game State /////
//////////////////////////////////////

var RED_TEXTURE = Pixi.Texture.fromImage(require("images/red-starship.png"))

class Hero extends Pixi.Sprite {
    constructor(image) {
        super(image)

        this.position.x = WIDTH * 0.15
        this.position.y = HEIGHT * 0.5
        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.maxVelocity = .5
        this.velocity = new Pixi.Point(0,0)
        this.friction = 2;
    }
    update(delta) {
        if(Keyb.isDown("<up>")) {
            this.velocity.y = this.maxVelocity * -1 * delta
        } if(Keyb.isDown("<down>")) {
            this.velocity.y = this.maxVelocity * delta
        } if(Keyb.isDown("<left>")) {
            this.velocity.x = this.maxVelocity * -1 * delta
        } if(Keyb.isDown("<right>")) {
            this.velocity.x = this.maxVelocity * delta
        }
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.velocity.y *= (1/this.friction)
        this.velocity.x *= (1/this.friction)
    }

}

var hero = new Hero(RED_TEXTURE)

var game = new Pixi.Container()
game.addChild(hero)

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

var loop = Afloop(function(delta) {
    delta = delta/(1000/60);
    hero.update(delta)

    renderer.render(game)
})
