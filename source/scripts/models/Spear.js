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
        this.anchor.y = .5
        this.anchor.x = .5
        this.sampleIntervalLength = this.height*2/NUMBER_OF_COLLISION_SAMPLES
    }

    update(){
        if(!this.parent.attackHasVictim){
            var samplePoints = []
            for(var i = 0; i < NUMBER_OF_COLLISION_SAMPLES && !this.parent.attackHasVictim; i++){
                var samplePoint = new Pixi.Point(0,0)
                samplePoint.x = this.parent.position.x - Math.cos(this.parent.rotation-Math.PI/2)*i*this.sampleIntervalLength
                samplePoint.y = this.parent.position.y - Math.sin(this.parent.rotation-Math.PI/2)*i*this.sampleIntervalLength
                samplePoints[i] = samplePoint
                var shouldBreak = false

                for(var j = 0; j < this.parent.game.monsters.children.length && !this.parent.attackHasVictim; j++){
                    var currentMonster = this.parent.game.monsters.children[j]
                    if(currentMonster.visible &&
                    Geometry.getDistance(currentMonster.position, samplePoints[i])
                    < currentMonster.radius){
                        currentMonster.beAttacked()
                        this.parent.attackHasVictim = true
                    }
                }
            }
        }

        // //Collision detection with Monster
        // var monsterRadiusForCollision = this.game.hero.radius
        // heroRadiusForCollision *= .6
        // if(Geometry.getDistance(this.position, this.game.hero.position) < this.radius + heroRadiusForCollision) {
        //     this.game.hero.beAttacked({
        //         velocity: this.velocity,
        //         damage: this.attack.damage,
        //         cooldown: this.attack.cooldown,
        //     })
        //     this.velocity = {x: 0, y: 0}
        // }
    }
}
