///////////////////////////////////
///// Importing Dependencies /////
/////////////////////////////////

import Pixi from "pixi.js"
import Afloop from "afloop"
import React from "react"
import ReactDOM from "react-dom"
import Screenfull from "screenfull"

///////////////////////////////////////
///// Instantiating the Renderer /////
/////////////////////////////////////

import Mount from "scripts/render/Mount.js"
var render = ReactDOM.render(<Mount/>, document.getElementById("mount"))

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

    render.setState({
        game: game
    })
})

//////////////////////////
///// Fullscreening /////
////////////////////////

document.addEventListener("keydown", (event) => {
    if(event.ctrlKey && event.keyCode == 70) {
        Screenfull.toggle()
    }
})
