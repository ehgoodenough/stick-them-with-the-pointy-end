///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

import Pixi from "pixi.js"
import Afloop from "afloop"

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

var WIDTH = 160, HEIGHT = 90

var renderer = new Pixi.CanvasRenderer(WIDTH, HEIGHT)
renderer.backgroundColor = 0x222222
renderer.roundPixels = true

document.body.appendChild(renderer.view)

////////////////////////////////////////
///// Establishing the Game State /////
//////////////////////////////////////

import Hero from "scripts/Hero.js"
import Tile from "scripts/Tile.js"

var game = new Pixi.Container()

game.addChild(new Tile({tx: 0, ty: 0}))
game.addChild(new Tile({tx: 1, ty: 0}))
game.addChild(new Tile({tx: 0, ty: 1}))

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
