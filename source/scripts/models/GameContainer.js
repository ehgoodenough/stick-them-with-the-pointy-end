import Pixi from "pixi.js"

import config from "config.js"
var world = require("data/world.json")

import Hero from "scripts/models/Hero.js"
import Monster from "scripts/models/Monster.js"
import Tile from "scripts/models/Tile.js"
import Camera from "scripts/models/Camera.js"

import KeyContainer from "scripts/utility/KeyContainer.js"

const CAMERA_TRANSITION_FRICTION = 0.05

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the objects.

        this.hero = new Hero({
            tx: 7, ty: 4
        })

        this.tiles = new KeyContainer()
        this.cameras = new KeyContainer()
        this.monsters = new KeyContainer()

        // Add to the container.

        this.addChild(this.tiles)
        this.addChild(this.cameras)
        this.addChild(this.monsters)
        this.addChild(this.hero)

        // Load from the data.

        world.tiles.forEach((tile) => {
            this.tiles.addChild(new Tile(tile))
        })
        world.cameras.forEach((camera) => {
            this.cameras.addChild(new Camera(camera))
        })

        this.monsters.addChild(new Monster(4, 8))

        // Setup the camera.

        this.targetposition = new Pixi.Point()
        this.hero.update()
        this.position.copy(this.targetposition)

        // console.log("To edit the world, change your mode by hitting 1, 2 or 3.")
        // console.log("To copy the world to your clipboard, run copy(game.data)")
    }
    addChild(child) {
        super.addChild(child)
        child.game = this
    }
    update(delta) {
        this.hero.update(delta)
        this.monsters.children.forEach((monster) => {
            monster.update(delta)
        })

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
