import Geometry from "scripts/utility/Geometry.js"
import config from "config.js"

export default class CircleCollider{
    constructor(position, scale) {
    	this.shape = "circle"
    	this.position = position
    	this.scale = scale.x * config.tile.size
    }
    checkForCollision(otherCollider){
        var foundACollision = false
    	if(otherCollider.shape == "circle"){
    		var distanceBetweenColliders = Geometry.getDistance(this.position, otherCollider.position)
    		var sumOfRadii = this.scale/2 + otherCollider.scale/2
    		if(distanceBetweenColliders < sumOfRadii){
                foundACollision = true
    		}
    	} else if(otherCollider.shape == "rectangle"){
            foundACollision = otherCollider.checkForCollision(this)
        }
        if(foundACollision){
            this.isColliding = true
        } else{
            this.isColliding = false
        }
        return foundACollision
    }
    update(position, scale, rotation){
        this.position = position
        this.scale = scale.x * config.tile.size
    }
}