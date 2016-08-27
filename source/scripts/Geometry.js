export default class Geometry{
    static getMagnitude(x, y){
        return Math.sqrt(x*x + y*y)
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
