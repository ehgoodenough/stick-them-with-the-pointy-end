export default class Sound {
    constructor(sound){
        this.sound = new Audio(sound)
        this.hasPlayedBefore = false
        this.sound.load()
    }
    playSound(){
        if(!this.hasPlayedBefore){
            this.hasPlayedBefore = true
            this.sound.volume = .5
        }else{
            this.sound.volume = 0.25
        }
        this.sound.fastSeek = 0

        this.sound.play()
    }
}
