///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

import Pixi from "pixi.js"
import Afloop from "afloop"

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

import config from "config.js"
var renderer = Pixi.autoDetectRenderer(config.frame.width, config.frame.height)
renderer.backgroundColor = 0x222222
renderer.roundPixels = true

document.getElementById("frame").appendChild(renderer.view)

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

    // Render to the canvas
    renderer.render(game)

    // Render to the DOM
    var hearts = new Object()
    hearts[1] = document.getElementById("1")
    hearts[2] = document.getElementById("2")
    hearts[3] = document.getElementById("3")
    hearts[1].className = ""
    hearts[2].className = ""
    hearts[3].className = ""
    if(game.hero.health >= 1) {
        hearts[1].className = "half heart"
    } if(game.hero.health >= 2) {
        hearts[1].className = "heart"
    } if(game.hero.health >= 3) {
        hearts[2].className = "half heart"
    } if(game.hero.health >= 4) {
        hearts[2].className = "heart"
    } if(game.hero.health >= 5) {
        hearts[3].className = "half heart"
    } if(game.hero.health >= 6) {
        hearts[3].className = "heart"
    }
})

///////////////////////////////
///// Linking up the DOM /////
/////////////////////////////

document.getElementById("play-again").addEventListener("click", (event) => {
    event.preventDefault()
    window.location = window.location
})
