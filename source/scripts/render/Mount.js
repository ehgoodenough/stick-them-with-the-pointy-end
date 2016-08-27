import React from "react"

import config from "config.js"

import PixiRenderer from "scripts/render/PixiRenderer.js"
import UihudComponents from "scripts/render/UihudComponents.js"

export default class Mount extends React.Component {
    render() {
        if(!!this.state) {
            return (
                <div id="frame">
                    <UihudComponents game={this.state.game}/>
                    <PixiRenderer game={this.state.game} frame={config.frame}/>
                </div>
            )
        } else {
            return (
                <div/>
            )
        }
    }
}
