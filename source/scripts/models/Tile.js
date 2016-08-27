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

        // I'm only scaling down the
        // tiles because the image that
        // I've imported is waaay too big.
        // The image is supposed to be a
        // 32x32, but it's a 64x64.
        this.scale.x /= 2
        this.scale.y /= 2

        // Used for collision
        this.radius = 8
    }
    containsPoint(point) {
        return Math.floor(this.position.x / config.tile.size) == Math.floor(point.x / config.tile.size)
            && Math.floor(this.position.y / config.tile.size) == Math.floor(point.y / config.tile.size)
    }
}
