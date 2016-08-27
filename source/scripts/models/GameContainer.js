import Pixi from "pixi.js"

import config from "config.js"

import Hero from "scripts/models/Hero.js"
import Monster from "scripts/models/Monster.js"
import Tile from "scripts/models/Tile.js"
import Camera from "scripts/models/Camera.js"

var world = require("data/world.json")

const CAMERA_TRANSITION_FRICTION = 0.05

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        this.superposition = new Pixi.Point()

        this.hero = new Hero()
        this.tiles = new Pixi.Container()
        this.cameras = new Pixi.Container()
        this.monsters = new Pixi.Container()

        var monster1 = new Monster(4, 4)
        this.monsters.addChild(monster1)

        this.addChild(this.tiles)
        this.addChild(this.cameras)
        this.addChild(this.monsters)
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
        for(var i=0; i<this.monsters.children.length; i++){
            this.monsters.children[i].update(delta)
        }

        // TODO: TWEEN THIS
        this.position.x += (this.superposition.x - this.position.x)/(1/CAMERA_TRANSITION_FRICTION)
        this.position.y += (this.superposition.y - this.position.y)/(1/CAMERA_TRANSITION_FRICTION)
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
