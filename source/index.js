///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

import Pixi from "pixi.js"
import Afloop from "afloop"

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

import config from "config.js"
const WIDTH = config.frame.width
const HEIGHT = config.frame.height

var renderer = new Pixi.CanvasRenderer(WIDTH, HEIGHT)
renderer.backgroundColor = 0x222222
renderer.roundPixels = true

document.body.appendChild(renderer.view)

////////////////////////////////////////
///// Establishing the Game State /////
//////////////////////////////////////

import GameContainer from "scripts/models/GameContainer.js"

var game = new GameContainer()

// We're only exposing this as
// a global variable so we can
// read it from the console! Do
// not try to use this in code.
window.game = game

//////////////////////////////////
///// Running the Game Loop /////
////////////////////////////////

var loop = Afloop(function(delta) {
    delta = {
        ms: delta, // in milliseconds
        s: delta / 1000, // in seconds
        f: delta / (1000 / 60), // in frames
    }

    game.update(delta)

    renderer.render(game)
})
