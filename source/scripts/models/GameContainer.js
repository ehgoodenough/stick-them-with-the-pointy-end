import Pixi from "pixi.js"

import config from "config.js"

import Hero from "scripts/models/Hero.js"
import Tile from "scripts/models/Tile.js"
import Camera from "scripts/models/Camera.js"

var world = require("data/world.json")

const CAMERA_TRANSITION_FRICTION = 0.05

class KeyContainer extends Pixi.Container {
    addChild(child) {
        super.addChild(child)
    }
    get data() {
        return this.children.map((child) => {
            return child.data
        })
    }
}

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        this.hero = new Hero()
        this.tiles = new KeyContainer()
        this.cameras = new KeyContainer()

        this.addChild(this.tiles)
        this.addChild(this.cameras)
        this.addChild(this.hero)

        world.tiles.forEach((tile) => {
            this.tiles.addChild(new Tile(tile))
        })
        world.cameras.forEach((camera) => {
            this.cameras.addChild(new Camera(camera))
        })

        this.targetposition = new Pixi.Point()
        this.hero.update()
        this.position.copy(this.targetposition)

        console.log("To edit the world, change your mode by hitting 1, 2 or 3.")
        console.log("To copy the world to your clipboard, run copy(game.data)")
    }
    update(delta) {
        this.hero.update(delta)

        this.position.x += (this.targetposition.x - this.position.x) / (1 / CAMERA_TRANSITION_FRICTION)
        this.position.y += (this.targetposition.y - this.position.y) / (1 / CAMERA_TRANSITION_FRICTION)
    }
    get data() {
        return {
            tiles: this.tiles.data,
            cameras: this.cameras.data,
            monsters: [],
            savepoints: [],
        }
    }
}
