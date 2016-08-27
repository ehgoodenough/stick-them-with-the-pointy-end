import Pixi from "pixi.js"

import config from "config.js"

import Hero from "scripts/models/Hero.js"
import Tile from "scripts/models/Tile.js"
import Camera from "scripts/models/Camera.js"

var WORLD = {
    CAMERAS: [
        {
            name: "alpha",
            tx: 0, ty: 0,
            tw: 14, th: 8,
            color: 0xCC0000,
        },
        {
            name: "omega",
            tx: 0, ty: 8,
            tw: 14, th: 16,
            color: 0x00CC00,
        },
        {
            name: "beta",
            tx: 13, ty: 1,
            tw: 4, th: 4,
            color: 0x0000CC,
        },
    ]
}

const CAMERA_TRANSITION_FRICTION = 0.05

export default class GameContainer extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the tiles
        this.tiles = new Pixi.Container()
        var LEVEL = require("raw!levels/dungeon.txt")
        var tiles = LEVEL.split("\n").map((row) => {
            return row.split("")
        })
        for(var ty = 0; ty < tiles.length; ty += 1) {
            for(var tx = 0; tx < tiles[ty].length; tx+= 1) {
                var tile = tiles[ty][tx]
                if(tile == "#") {
                    this.tiles.addChild(new Tile({
                        tx: tx, ty: ty
                    }))
                }
            }
        }
        this.addChild(this.tiles)

        // Instantiate the cameras
        this.cameras = new Pixi.Container()
        WORLD.CAMERAS.forEach((camera) => {
            camera = new Camera(camera)
            this.cameras.addChild(camera)
        })
        this.addChild(this.cameras)

        // Instantiate the hero
        this.hero = new Hero()
        this.addChild(this.hero)


        this.superposition = new Pixi.Point()
    }
    update(delta) {
        this.hero.update(delta)

        // TODO: TWEEN THIS
        this.position.x += (this.superposition.x - this.position.x)/(1/CAMERA_TRANSITION_FRICTION)
        this.position.y += (this.superposition.y - this.position.y)/(1/CAMERA_TRANSITION_FRICTION)
    }
}
