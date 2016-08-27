import Pixi from "pixi.js"

import config from "config.js"

import Hero from "scripts/models/Hero.js"
import Tile from "scripts/models/Tile.js"
import Camera from "scripts/models/Camera.js"

var world = require("data/world.json")

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        this.superposition = new Pixi.Point()

        this.hero = new Hero()
        this.tiles = new Pixi.Container()
        this.cameras = new Pixi.Container()

        this.addChild(this.tiles)
        this.addChild(this.cameras)
        this.addChild(this.hero)

        world.tiles.forEach((tile) => {
            this.tiles.addChild(new Tile(tile))
        })
        world.cameras.forEach((camera) => {
            this.cameras.addChild(new Camera(camera))
        })

        console.log("To edit the world, change your mode by hitting 1, 2 or 3.")
        console.log("To copy the world to your clipboard, run copy(game.data)")
    }
    update(delta) {
        this.hero.update(delta)

        // TODO: TWEEN THIS
        this.position.x = this.superposition.x
        this.position.y = this.superposition.y
    }
    get data() {
        var data = {
            tiles: [],
            cameras: [],
            monsters: [],
            savepoints: [],
        }

        this.tiles.children.forEach((tile) => {
            data.tiles.push({
                tx: tile.tx, ty: tile.ty
            })
        })

        this.cameras.children.forEach((camera) => {
            data.cameras.push({
                tx: camera.tx, ty: camera.ty,
                tw: camera.tw, th: camera.th
            })
        })

        return data
    }
}
