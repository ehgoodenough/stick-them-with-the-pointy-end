export default class Sound {
    constructor(sound){
        this.sounds = []
        if(sound instanceof Array){
            this.sounds = sound
        } else{
            this.sounds = [sound]
        }
        for(var i = 0; i < this.sounds.length; i++){
            this.sounds[i] = new Audio(this.sounds[i])
            this.sounds[i].hasPlayedBefore = false
            this.sounds[i].load()
        }
    }
    playSound(){
        if(this.sounds.length > 1){
            var randomSound = this.sounds[Math.floor(Math.random() * this.sounds.length)]
        } else{
            var randomSound = this.sounds[0]
        }
        if(!randomSound.hasPlayedBefore){
            randomSound.hasPlayedBefore = true
            randomSound.volume = .5
        }else{
            randomSound.volume = 0.25
        }
        if(randomSound.fastSeek){
            randomSound.fastSeek(0)
        }else{
            randomSound.currentTime = 0
        }
        randomSound.play()
    }
}
