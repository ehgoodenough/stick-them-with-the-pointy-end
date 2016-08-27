import Pixi from "pixi.js"

var TILE_SIZE = 16
var WALL_TEXTURE = Pixi.Texture.fromImage(require("images/wall1.png"))

export default class Tile extends Pixi.Sprite {
    constructor(tile) {
        super(WALL_TEXTURE)
        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (tile.tx + this.anchor.x) * TILE_SIZE
        this.position.y = (tile.ty + this.anchor.y) * TILE_SIZE

        // I'm only scaling down the
        // tiles because the image that
        // I've imported is waaay too big.
        this.scale.x /= 4
        this.scale.y /= 4

        // Used for collision
        this.radius = 8
    }
    hasPoint(point) {
        return Math.floor(this.position.x / TILE_SIZE) == Math.floor(point.x / TILE_SIZE)
            && Math.floor(this.position.y / TILE_SIZE) == Math.floor(point.y / TILE_SIZE)
    }
}
