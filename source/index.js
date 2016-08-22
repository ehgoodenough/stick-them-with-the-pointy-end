///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

// Because of Babel and Webpack, we can use
// syntax from Node and ECMA2015 specs, which
// includes the "require" statement.

// We're importing Pixi for canvas rendering.
var Pixi = require("pixi.js")

// We're importing Afloop for the main loop.
var Afloop = require("afloop")

// All of these dependencies are listed in
// our package.json, and are automatically
// downloaded when you run `npm install`.

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

// We need to instantiate the Pixi Renderer
// before we can use it to render our sprites.

// Declare a 16x9 aspect-ratio. :]
var WIDTH = 160, HEIGHT = 90

// Create the new renderer. It's called a renderer,
// but it's really just a canvas wrapper. Go ahead
// and give our canvas a default background color.
var renderer = new Pixi.CanvasRenderer(WIDTH, HEIGHT)
renderer.backgroundColor = 0xEEEEEE
renderer.roundPixels = true

// The renderer automatically generates the
// HTML5 canvas tag, which we are responsible
// for inserting into the page. That tag can
// found at `renderer.view`.
document.body.appendChild(renderer.view)

////////////////////////////////////////
///// Establishing the Game State /////
//////////////////////////////////////

// So for something in our game to rendered
// to the screen, it needs to be a Pixi.Sprite.
// A sprite has a lot of data, like width and
// height and position and texture and whatever:
// https://pixijs.github.io/docs/PIXI.Sprite.html

// To create a sprite, you need an image. We'll
// load these textures from our `images` directory.
var RED_TEXTURE = Pixi.Texture.fromImage(require("images/red-starship.png"))
var BLUE_TEXTURE = Pixi.Texture.fromImage(require("images/blue-starship.png"))

// Let's make a sprite! We have to give it a texture.
var sprite = new Pixi.Sprite(RED_TEXTURE)

// But that's so boring! Let's just subclass
// the sprite and add our own functionality!

class Hero extends Pixi.Sprite {
    // Because we inheriting from sprite, we're
    // responsible for adding a `super` call to
    // our superclass. Yay for OOP. :\
    constructor(image) {
        super(image)

        // But once we do that, we can
        // override whatever we want.
        this.position.x = WIDTH * 0.15
        this.position.y = HEIGHT * 0.5
        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }
    // We'll add a method to run
    // each frame to update the sprite.
    update(delta) {
        // This will move our sprite
        // across the screen! Why not?
        this.position.x += 0.1 * delta
    }
}

// And there we go! A custom extended sprite. Nice.
var hero = new Hero(BLUE_TEXTURE)

// Oh, also, if you want to render multiple
// sprites, you'll need to drop them in a new
// Pixi.Container, which we'll call our "game."

var game = new Pixi.Container()
game.addChild(sprite)
game.addChild(hero)

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

// We're using Afloop to handle our
// loop; just pass it a function and
// it'll run it over and over and over.
var loop = Afloop(function(delta) {

    // Update our hero.
    hero.update(delta)

    // Render to the canvas! Pass it
    // our container to render all
    // our sprites all at once. :]
    renderer.render(game)
})

// To run this code, run `npm install`, then `node build server`.
// When running the build server, any changes to this file is
// immeaditely refreshed in the browser! Try it! :D
