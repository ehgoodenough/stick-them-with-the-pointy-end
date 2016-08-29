import Pixi from "pixi.js"

import config from "config.js"

var WALL_TEXTURE = Pixi.Texture.fromImage(require("images/wall1.png"))
var ACTUAL_WALL_TEXTURES = [
    Pixi.Texture.fromImage(require("images/door1.png")),
    Pixi.Texture.fromImage(require("images/door2.png")),
]

export default class Tile extends Pixi.Sprite {
    constructor(tile) {
        super(WALL_TEXTURE)
        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (tile.tx + this.anchor.x) * config.tile.size
        this.position.y = (tile.ty + this.anchor.y) * config.tile.size

        // Used for collision
        this.radius = 8

        this.isVisible = tile.isVisible
        this.isPassable = false
        if(tile.textureIndex != undefined) {
            this.textureIndex = tile.textureIndex
            this.texture = ACTUAL_WALL_TEXTURES[tile.textureIndex]
        }
        this.tag = tile.tag
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
        var data = {
            tx: this.tx,
            ty: this.ty
        }
        if(this.isVisible != undefined) {
            data.isVisible = this.isVisible
        } if(this.textureIndex != undefined) {
            data.textureIndex = this.textureIndex
        } if(this.tag != undefined) {
            data.tag = this.tag
        }
        return data
    }
    get key() {
        return Math.floor(this.position.x / config.tile.size) + "-" + Math.floor(this.position.y / config.tile.size)
    }
    get visible() {
        return this.isVisible
    }
}
