import React from "react"
import "./base.min.css"
import "./fancy.min.css"
import { AnimatedScene } from "./scene/animated-scene"

function App() {
  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onClick={(e) => {
        console.log(e.clientX, e.clientY)
      }}
    >
      <AnimatedScene />
    </div>
  )
}
export default App
