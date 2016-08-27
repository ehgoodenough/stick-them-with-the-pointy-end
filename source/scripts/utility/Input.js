import Keyb from "keyb"

export default class Input {
    static getX() {
        if(Keyb.isDown("<left>")) {
            return -1
        } else if(Keyb.isDown("<right>")) {
            return +1
        } else if(!!this.gamepads[0]) {
            if(this.gamepads[0].axes.length == 4) {
                return this.gamepads[0].axes[0]
            } else if(this.gamepads[0].axes.length == 5) {
                return this.gamepads[0].axes[1]
            }
        } else {
            return 0
        }
    }
    static getY() {
        if(Keyb.isDown("<up>")) {
            return -1
        } else if(Keyb.isDown("<down>")) {
            return +1
        } else if(!!this.gamepads[0]) {
            if(this.gamepads[0].axes.length == 4) {
                return this.gamepads[0].axes[1]
            } else if(this.gamepads[0].axes.length == 5) {
                return this.gamepads[0].axes[2]
            }
        } else {
            return 0
        }
    }
    static getButton() {
        if(Keyb.isDown("<space>")) {
            return true
        } else if(!!this.gamepads[0]) {
            for(var i = 0; i < 4; i++) {
                if(this.gamepads[0].buttons[i].pressed) {
                    return true
                }
            }
        } else {
            return false
        }
    }
    static update() {
        this.gamepads = navigator.getGamepads()
    }
}

// if(gamepads[0] != undefined) {
//     var axes = gamepads[0].axes.slice()
//     if(axes.length == 5){
//         axes.shift()
//     }
//     var x = axes[0]
//     var y = axes[1]
// }
