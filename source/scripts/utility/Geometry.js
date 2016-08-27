export default class Geometry {
    static getMagnitude(x, y) {
        return Math.sqrt(x*x + y*y)
    }
    static getDistance(point1, point2) {
        var resultVector = {x: point2.x - point1.x, y: point2.y - point1.y}
        return Geometry.getMagnitude(resultVector.x, resultVector.y)
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
