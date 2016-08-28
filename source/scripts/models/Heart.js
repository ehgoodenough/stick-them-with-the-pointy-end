import Pixi from "pixi.js"

var HEART_TEXTURE = Pixi.Texture.fromImage(require("images/heart.png"))
var HALFHEART_TEXTURE = Pixi.Texture.fromImage(require("images/halfheart.png"))

export default class Heart extends Pixi.Sprite {
    constructor(heart) {
        super(HEART_TEXTURE)

        // i'll do this tomorrow.
    }
}
