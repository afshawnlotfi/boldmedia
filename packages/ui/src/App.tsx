import React from "react"
import "./base.min.css"
import "./fancy.min.css"
import { AnimatedScene } from "./scene/animated-scene"

function App() {
  return (
    <div
      onClick={(e) => {
        console.log(e.screenX, e.screenY)
      }}
    >
      <AnimatedScene />
    </div>
  )
}
export default App
