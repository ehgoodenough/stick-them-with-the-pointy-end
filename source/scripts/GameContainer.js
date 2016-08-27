import Pixi from "pixi.js"

import Hero from "scripts/Hero.js"
import Tile from "scripts/Tile.js"

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        this.addChild(new Tile({tx: 0, ty: 0}))
        this.addChild(new Tile({tx: 1, ty: 0}))
        this.addChild(new Tile({tx: 0, ty: 1}))
        this.addChild(new Hero())
    }
    addChild(child) {
        super.addChild(child)

        if(child instanceof Hero) {
            this.hero = child
        }
    }
    update(delta) {
        this.hero.update(delta)
    }
}
