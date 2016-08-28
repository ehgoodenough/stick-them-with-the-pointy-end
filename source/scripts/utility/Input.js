import Keyb from "keyb"

export default class Input {
    static getX() {
        if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
            return -1
        } else if(Keyb.isDown("D") || Keyb.isDown("<right>")) {
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
        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            return -1
        } else if(Keyb.isDown("S") || Keyb.isDown("<down>")) {
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
        if(Keyb.isJustDown("<space>")) {
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
    static getAltButton() {
        if(Keyb.isJustDown("<shift>")) {
            return true
        } else if(!!this.gamepads[0]) {
            for(var i = 4; i < 8; i++) {
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
    static get gamepad() {
        if(!!this.gamepads) {
            return this.gamepads[0]
        }
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
