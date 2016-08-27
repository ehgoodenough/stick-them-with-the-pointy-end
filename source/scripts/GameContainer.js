import Pixi from "pixi.js"

import config from "config.js"

import Hero from "scripts/Hero.js"
import Tile from "scripts/Tile.js"

var LEVEL = require("raw!levels/dungeon.txt")
var tiles = LEVEL.split("\n").map((row) => {
    return row.split("")
})

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        for(var ty = 0; ty < tiles.length; ty += 1) {
            for(var tx = 0; tx < tiles[ty].length; tx+= 1) {
                var tile = tiles[ty][tx]
                if(tile == "#") {
                    this.addChild(new Tile({
                        tx: tx, ty: ty
                    }))
                }
            }
        }

        this.addChild(new Hero())

        // this.scale.x /= 2
        // this.scale.y /= 2
    }
    addChild(child) {
        super.addChild(child)

        if(child instanceof Hero) {
            this.hero = child
        }
    }
    update(delta) {
        this.hero.update(delta)

        this.position.x = -1 * (this.hero.position.x - (config.frame.width / 2))
        this.position.y = -1 * (this.hero.position.y - (config.frame.height / 2))
    }
}
