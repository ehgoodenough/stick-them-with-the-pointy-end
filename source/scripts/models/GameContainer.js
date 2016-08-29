import Pixi from "pixi.js"
import Keyb from "keyb"

import config from "config.js"
var world = require("data/world.json")

import Hero from "scripts/models/Hero.js"
import Monster from "scripts/models/Monster.js"
import Tile from "scripts/models/Tile.js"
import Camera from "scripts/models/Camera.js"
import Floor from "scripts/models/Floor.js"

import KeyContainer from "scripts/utility/KeyContainer.js"

const CAMERA_TRANSITION_FRICTION = 0.05

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the objects.

        this.hero = new Hero(world.hero)

        this.tiles = new KeyContainer()
        this.cameras = new KeyContainer()
        this.monsters = new KeyContainer()
        this.floors = new KeyContainer()

        // Add to the container.

        this.addChild(this.floors)
        this.addChild(this.tiles)
        this.addChild(this.cameras)
        this.addChild(this.monsters)
        this.addChild(this.hero)


        // Load from the data.

        world.floors.forEach((floor) => {
            this.floors.addChild(new Floor(floor))
        })
        world.tiles.forEach((tile) => {
            this.tiles.addChild(new Tile(tile))
        })
        world.cameras.forEach((camera) => {
            this.cameras.addChild(new Camera(camera))
        })
        world.monsters.forEach((monster) => {
            this.monsters.addChild(new Monster(monster))
        })

        // Setup the camera.

        this.targetposition = new Pixi.Point()
        this.jumpCameraToHero()

        // console.log("To edit the world, change your mode by hitting 1, 2 or 3.")
        // console.log("To copy the world to your clipboard, run copy(game.data)")
    }
    jumpCameraToHero() {
        this.hero.considerTheCamera()
        this.position.x = this.targetposition.x
        this.position.y = this.targetposition.y
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
        this.monsters.sortChildren()

        this.position.x += (this.targetposition.x - this.position.x) / (1 / CAMERA_TRANSITION_FRICTION)
        this.position.y += (this.targetposition.y - this.position.y) / (1 / CAMERA_TRANSITION_FRICTION)
            if(this.hero.mode != "GAME MODE") {
                if(Keyb.isJustDown("R")) {
                    var position = this.hero.position.clone()
                    this.hero.beKilled()
                    this.hero.position.copy(position)
                }

                if(Keyb.isDown("T")) {
                    this.scale.x = 0.25
                    this.scale.y = 0.25
                    this.position.x = 3 * 32
                    this.position.y = 8 * 32
                } else {
                    this.scale.x = 1
                    this.scale.y = 1
                }
            }
    }
    get data() {
        return {
            hero: this.hero.data,
            tiles: this.tiles.data,
            floors: this.floors.data,
            cameras: this.cameras.data,
            monsters: this.monsters.data,
        }
    }
}
