import Pixi from "pixi.js"

export default class KeyContainer extends Pixi.Container {
    constructor() {
        super()
        this.childrenByKey = {}
    }
    addChild(child) {
        super.addChild(child)
        child.game = this.game

        if(child.key != undefined) {
            this.childrenByKey[child.key] = child
        }
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
