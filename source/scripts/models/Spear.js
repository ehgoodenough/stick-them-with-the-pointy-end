import Pixi from "pixi.js"
import Geometry from "scripts/utility/Geometry.js"

import config from "config.js"


var SPEAR_TEXTURE = Pixi.Texture.fromImage(require("images/spear.png"))
var NUMBER_OF_COLLISION_SAMPLES = 4
export default class Spear extends Pixi.Sprite {
    constructor(spear){
        super(SPEAR_TEXTURE)
        this.position.x = spear.x
        this.position.y = spear.y
        this.anchor.y = 0.5
        this.anchor.x = 0.5
        this.sampleIntervalLength = this.height*2/NUMBER_OF_COLLISION_SAMPLES
    }
    update(){
        if(!this.parent.attackHasVictim) {
            for(var i = 0; i < NUMBER_OF_COLLISION_SAMPLES && !this.parent.attackHasVictim; i++) {
                var samplePoint = new Pixi.Point(0,0)
                samplePoint.x = this.parent.position.x - Math.cos(this.parent.rotation-Math.PI/2)*i*this.sampleIntervalLength
                samplePoint.y = this.parent.position.y - Math.sin(this.parent.rotation-Math.PI/2)*i*this.sampleIntervalLength

                for(var j = 0; j < this.parent.game.monsters.children.length && !this.parent.attackHasVictim; j++) {
                    var currentMonster = this.parent.game.monsters.children[j]
                    if(currentMonster.hasBeenKilled != true
                    && Geometry.getDistance(currentMonster.position, samplePoint) < currentMonster.radius) {
                        currentMonster.beAttacked()
                        this.parent.attackHasVictim = true
                    }
                }
            }
        }
    }
}
