import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"
import Sound from "scripts/utility/Sound.js"

import config from "config.js"

var SPEAR_TEXTURE = Pixi.Texture.fromImage(require("images/spear.png"))
var WALL_HIT_SOUND = new Sound(require("sounds/wallhit.mp3"))
var NUMBER_OF_COLLISION_SAMPLES = 4
export default class Spear extends Pixi.Sprite {
    constructor(spear) {
        super(SPEAR_TEXTURE)
        this.position.x = spear.x
        this.position.y = spear.y
        this.anchor.y = 0.5
        this.anchor.x = 0.5
        this.sampleIntervalLength = this.height*2/NUMBER_OF_COLLISION_SAMPLES
        this.attackHasVictim = false
        this.hasHitAWallBefore = false
    }
    update() {
        if(!this.attackHasVictim) {
            for(var i = 0; i < NUMBER_OF_COLLISION_SAMPLES && !this.attackHasVictim; i++){
                var samplePoint = new Pixi.Point(0,0)
                samplePoint.x = this.parent.position.x - Math.cos(this.parent.rotation-Math.PI/2)*i*this.sampleIntervalLength
                samplePoint.y = this.parent.position.y - Math.sin(this.parent.rotation-Math.PI/2)*i*this.sampleIntervalLength

                if(i < 3){
                    var tileKey = Math.floor(samplePoint.x / config.tile.size) + "-" + Math.floor(samplePoint.y / config.tile.size)
                    var currentTile = this.parent.game.tiles.childrenByKey[tileKey]
                    if(currentTile != null){
                        WALL_HIT_SOUND.playSound()
                        this.attackHasVictim = true
                    }
                }

                for(var j = 0; j < this.parent.game.monsters.children.length && !this.attackHasVictim; j++){
                    var currentMonster = this.parent.game.monsters.children[j]
                    if(currentMonster.IsDead != true
                    && Geometry.getDistance(currentMonster.position, samplePoint) < currentMonster.radius) {
                        this.attackHasVictim = true
                        currentMonster.beAttacked({
                            direction: this.parent.rotation,
                            duration: 0.05,
                            force: 15
                        })
                    }
                }
            }
        }
    }
}
