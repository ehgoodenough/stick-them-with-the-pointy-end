import Pixi from "pixi.js"
import config from "config.js"

var FLOOR_TEXTURES = [
    Pixi.Texture.fromImage(require("images/allFloors1.png"))
    //Pixi.Texture.fromImage(require("images/SecondFloorSet.png"))
    //Pixi.Texture.fromImage(require("images/ThirdFloorSet.png"))
    //Pixi.Texture.fromImage(require("images/cartographerDrawing1.png"))
    // Pixi.Texture.fromImage(require("images/hero.png")),
    // Pixi.Texture.fromImage(require("images/hero.png")),
    // Pixi.Texture.fromImage(require("images/hero.png")),
    // Pixi.Texture.fromImage(require("images/hero.png"))
]

export default class Floor extends Pixi.Sprite {
    constructor(floor) {
        super(FLOOR_TEXTURES[floor.textureIndex])
        this.textureIndex = floor.textureIndex
        this.spawnPosition = {tx: floor.tx, ty: floor.ty}
        this.anchor.x = 0
        this.anchor.y = 0
        this.position.x = (floor.tx + this.anchor.x) * config.tile.size
        this.position.y = (floor.ty + this.anchor.y) * config.tile.size
    }
    get data(){
        return {
            tx: this.spawnPosition.tx,
            ty: this.spawnPosition.ty,
            textureIndex: this.textureIndex
        }
    }
}
