export default class Geometry {
    static getMagnitude(x, y) {
        if(x != 0 || y != 0){
            return Math.sqrt(x*x + y*y)
        }
        else return 0;
    }
    static getDistance(point1, point2) {
        var vector = {x: point2.x - point1.x, y: point2.y - point1.y}
        return Geometry.getMagnitude(vector.x, vector.y)
    }
    static getAngle(x, y) {
        var angle = Math.atan2(y, x)
        if(angle < 0) {
            angle += Math.PI*2
        }
        angle -= Math.PI/2
        return angle
    }
}
