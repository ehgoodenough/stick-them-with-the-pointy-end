import Pixi from "pixi.js"

export default class KeyContainer extends Pixi.Container {
    addChild(child) {
        super.addChild(child)
        child.game = this.game
    }
    get data() {
        return this.children.map((child) => {
            return child.data
        })
    }
}
