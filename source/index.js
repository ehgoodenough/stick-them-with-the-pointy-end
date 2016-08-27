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

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.png"))

class Hero extends Pixi.Sprite {
    constructor(image) {
        super(image)

        this.position.x = WIDTH * 0.15
        this.position.y = HEIGHT * 0.5
        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 0.5
    }
    update(delta) {
        if(Keyb.isDown("<up>") || Keyb.isDown("W")) {
            this.position.y -= this.speed * delta
            //this.rotation = 180 * (Math.PI / 180)
        } if(Keyb.isDown("<down>") || Keyb.isDown("S")) {
            this.position.y += this.speed * delta
            // this.rotation = 0 * (Math.PI / 180)
        } if(Keyb.isDown("<left>") || Keyb.isDown("A")) {
            this.position.x -= this.speed * delta
            // this.rotation = 90 * (Math.PI / 180)
        } if(Keyb.isDown("<right>") || Keyb.isDown("D")) {
            this.position.x += this.speed * delta
            // this.rotation = 270 * (Math.PI / 180)
        }

        var gamepads = navigator.getGamepads()
        if(gamepads[0] != undefined) {
            var x = gamepads[0].axes[0]
            var y = gamepads[0].axes[1]

            var magnitude = Math.sqrt(x*x + y*y)
            if(magnitude > 0.05) {
                this.rotation
            }
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
}

var hero = new Hero(HERO_TEXTURE)

var game = new Pixi.Container()
game.addChild(hero)

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

var loop = Afloop(function(delta) {
    delta = delta / (1000 / 60)


    hero.update(delta)

    renderer.render(game)
})
