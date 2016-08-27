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
var BLUE_TEXTURE = Pixi.Texture.fromImage(require("images/blue-starship.png"))
var GREEN_TEXTURE = Pixi.Texture.fromImage(require("images/green-starship.png"))
var YELLOW_TEXTURE = Pixi.Texture.fromImage(require("images/yellow-starship.png"))

var SPACESHIPS = [
    {
        speed: 0.05,
        texture: RED_TEXTURE,
        onShootSpeed: 100,
        onShoot: function() {
            console.log("BANG")
        }
    },
    {
        speed: 0.1,
        texture: BLUE_TEXTURE,
        onShootSpeed: 200,
        onShoot: function() {
            console.log("BOOM")
        }
    },
    {
        speed: 0.025,
        texture: GREEN_TEXTURE,
        onShootSpeed: 50,
        onShoot: function() {
            console.log("BZAP")
        }
    },
    {
        speed: 0.1,
        texture: YELLOW_TEXTURE,
        onShootSpeed: 75,
        onShoot: function() {
            console.log("BOOF")
        }
    }
]

class Hero extends Pixi.Sprite {
    constructor(image) {
        super(image)

        this.position.x = WIDTH * 0.15
        this.position.y = HEIGHT * 0.5
        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.spaceshipIndex = 0
        this.setSpaceship(SPACESHIPS[this.spaceshipIndex])

        this.onShootTimer = 0
    }
    update(delta) {
        if(Keyb.isDown("<up>")) {
            this.position.y -= this.speed * delta
        } if(Keyb.isDown("<down>")) {
            this.position.y += this.speed * delta
        } if(Keyb.isDown("<left>")) {
            this.position.x -= this.speed * delta
        } if(Keyb.isDown("<right>")) {
            this.position.x += this.speed * delta
        }

        if(Keyb.isJustDown("<shift>", delta)) {
            this.spaceshipIndex = (this.spaceshipIndex + 1) % SPACESHIPS.length
            var spaceship = SPACESHIPS[this.spaceshipIndex]

            this.setSpaceship(spaceship)
        }

        this.onShootTimer += delta
        if(this.onShootTimer > this.onShootSpeed) {
            this.onShootTimer = 0
            this.onShoot()
        }
    }
    setSpaceship(spaceship) {
        this.texture = spaceship.texture
        this.speed = spaceship.speed
        this.onShoot = spaceship.onShoot
        this.onShootSpeed = spaceship.onShootSpeed
    }
}

var hero = new Hero(BLUE_TEXTURE)

var game = new Pixi.Container()
game.addChild(hero)

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

var loop = Afloop(function(delta) {

    hero.update(delta)

    renderer.render(game)
})
