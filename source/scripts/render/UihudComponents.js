import React from "react"

export default class UihudComponents extends React.Component {
    render() {
        var hearts = []
        for(var i = 0; i < Math.floor(this.props.game.hero.health / 2); i++) {
            hearts.push(<div key={i} className="heart"/>)
        }
        if(this.props.game.hero.health % 2 == 1) {
            hearts.push(<div key="0.5" className="half heart"/>)
        }
        return (
            <div id="uihud">
                <div id="hearts">
                    {hearts}
                </div>
            </div>
        )
    }
}
