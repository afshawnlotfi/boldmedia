import React from "react"
import { AnimatedScene } from "./scene/animated-scene"

function App() {
  return (
    <div onClick={(e) => {

      console.log(e.screenX, e.screenY)
    }}>
      <AnimatedScene />
    </div>
  )
}
export default App
