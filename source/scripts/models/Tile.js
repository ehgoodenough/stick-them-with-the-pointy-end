import Pixi from "pixi.js"

import config from "config.js"

var WALL_TEXTURE = Pixi.Texture.fromImage(require("images/wall1.png"))

export default class Tile extends Pixi.Sprite {
    constructor(tile) {
        super(WALL_TEXTURE)
        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (tile.tx + this.anchor.x) * config.tile.size
        this.position.y = (tile.ty + this.anchor.y) * config.tile.size

        // Used for collision
        this.radius = 8
    }
    containsPoint(point) {
        return this.tx == Math.floor(point.x / config.tile.size)
            && this.ty == Math.floor(point.y / config.tile.size)
    }
    get tx() {
        return Math.floor(this.position.x / config.tile.size)
    }
    get ty() {
        return Math.floor(this.position.y / config.tile.size)
    }
    get data() {
        return {
            tx: this.tx,
            ty: this.ty
        }
    }
    get key() {
        return Math.floor(this.position.x / config.tile.size) + "-" + Math.floor(this.position.y / config.tile.size)
    }
    get alpha() {
        if(this.game.hero.mode != "GAME MODE") {
            return 1
        } else {
            return 0.25
        }
    }
    // Uncomment this method when it's
    // finally time to hide tiles!!
    // get visible() {
    //     return this.game.hero.mode != "GAME MODE"
    // }
}
