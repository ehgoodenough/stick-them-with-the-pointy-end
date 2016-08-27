export default class Geometry{
    static getMagnitude(vector){
        return Math.sqrt(vector.y*vector.y + vector.x*vector.x)
    }

    static getAngle(x, y){
        var angle = Math.atan2(y, x)
        if(angle < 0){
            angle += Math.PI*2
        }
        angle -= Math.PI/2
        return angle
    }
}
