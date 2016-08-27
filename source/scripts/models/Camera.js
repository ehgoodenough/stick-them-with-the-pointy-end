import Pixi from "pixi.js"

import config from "config.js"

var WHITE_TEXTURE = Pixi.Texture.fromImage(require("images/white.png"))

export default class Camera extends Pixi.Sprite {
    constructor(camera) {
        super(WHITE_TEXTURE)

        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.position.x = (camera.tx + (camera.tw / 2)) * config.tile.size
        this.position.y = (camera.ty + (camera.th / 2)) * config.tile.size
        this.scale.x = camera.tw
        this.scale.y = camera.th

        this.tint = camera.color || 0xFFFFFF
        this.name = camera.name || "no-name"
    }
    get alpha() {
        return this.game.hero.mode.startsWith("DEV MODE") ? 0.25 : 0
    }
    get x1() {
        return this.x - (this.width / 2)
    }
    get x2() {
        return this.x + (this.width / 2)
    }
    get y1() {
        return this.y - (this.height / 2)
    }
    get y2() {
        return this.y + (this.height / 2)
    }
    get tx() {
        return Math.floor(this.x1 / config.tile.size)
    }
    get ty() {
        return Math.floor(this.y1 / config.tile.size)
    }
    get tw() {
        return Math.floor(this.width / config.tile.size)
    }
    get th() {
        return Math.floor(this.height / config.tile.size)
    }
    get data() {
        return {
            tx: this.tx,
            ty: this.ty,
            tw: this.tw,
            th: this.th
        }
    }
    get game() {
        return this.parent.parent
    }
    containsPoint(point) {
        return point.x > this.x1
            && point.y > this.y1
            && point.x < this.x2
            && point.y < this.y2
    }
    focus() {
        // this.x
        if(this.width < config.frame.width) {
            this.game.targetposition.x = -1 * (this.x - (config.frame.width / 2))
        } else {
            this.game.targetposition.x = this.game.hero.position.x - (config.frame.width / 2)
            if(this.game.targetposition.x < this.x1 - (config.tile.size / 4)) {
                this.game.targetposition.x = this.x1 - (config.tile.size / 4)
            }
            if(this.game.targetposition.x > this.x2 - config.frame.width + (config.tile.size / 4)) {
                this.game.targetposition.x = this.x2 - config.frame.width + (config.tile.size / 4)
            }
            this.game.targetposition.x *= -1
        }

        // If the zone is smaller than the screen
        if(this.height < config.frame.height) {
            // Then
            this.game.targetposition.y = -1 * (this.position.y - (config.frame.height / 2))
        } else {
            this.game.targetposition.y = this.game.hero.position.y - (config.frame.height / 2)
            if(this.game.targetposition.y < this.y1 - (config.tile.size / 4)) {
                this.game.targetposition.y = this.y1 - (config.tile.size / 4)
            }
            if(this.game.targetposition.y > this.y2 - config.frame.height + (config.tile.size / 4)) {
                this.game.targetposition.y = this.y2 - config.frame.height + (config.tile.size / 4)
            }
            this.game.targetposition.y *= -1
        }
    }
}
