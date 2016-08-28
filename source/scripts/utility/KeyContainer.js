import Pixi from "pixi.js"

export default class KeyContainer extends Pixi.Container {
    constructor() {
        super()
        this.childrenByKey = {}
    }
    addChild(child) {
        child.game = this.game
        if(child.key != undefined) {
            if(this.childrenByKey[child.key] != undefined) {
                this.removeChild(this.childrenByKey[child.key])
            }
            this.childrenByKey[child.key] = child
        }
        super.addChild(child)
    }
    get data() {
        return this.children.map((child) => {
            return child.data
        })
    }
    sortChildren() {
        this.children.sort(function(a, b) {
            return a.order - b.order
        })
    }
}
