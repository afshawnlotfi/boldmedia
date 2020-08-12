import { kineticFrame, zoomIn } from "@scenejs/effects"
import React, { useState } from "react"
import { Scene } from "react-scenejs"
import { AnimatedPlayer } from "../components/animation/animation-player"
import { Nbc1Document } from "../documents/components/nbc/nbc"
import { highlight } from "../effects/highlight"

export const AnimatedScene = () => {
  const [isPlaying, changeIsPlaying] = useState(false)
  const [sceneEl, changeSceneEl] = useState<Scene>()
  const keyframes2 = {
    ".box": {
      1: zoomIn({ from: 1, to: 2, duration: 1 }),
      0: kineticFrame({ left: "0px", top: "15%" }).set({
        transform: "rotate(0deg)",
      }),

      // 1: kineticFrame({ left: "0px", top: "0px" }).set({
      //   transform: "rotate(0deg)",
      // }),
    },
    ".textEx": {
      // 0.2: wipeIn({ duration: 1, direction: "reverse" }),
      // 0.2: wipeIn({ duration: 0.5, property: "bottom" }),
      ...highlight(0.2, 0.4),

      // 0.2: wipeIn({ duration: 1, direction: "reverse" })
    },
  }

  let inputEl: HTMLInputElement | null

  return (
    <AnimatedPlayer
      isPlaying={isPlaying}
      sceneEl={sceneEl}
      setInputEl={(el) => {
        inputEl = el
      }}
    >
      <Scene
        ref={(e) => {
          changeSceneEl(e ?? undefined)
          // @ts-ignore
          window.scene = e?.getItem()
        }}
        keyframes={keyframes2}
        easing={"ease-in-out"}
        fillMode={"forwards"}
        onAnimate={(e) => {
          if (inputEl) {
            inputEl.value = `${(100 * e.time) / e.currentTarget.getDuration()}`
          }
        }}
        onPlay={() => {
          changeIsPlaying(true)
        }}
        onPaused={() => {
          changeIsPlaying(false)
        }}
      >
        {/* <Highlighter className={"textEx"} text={"HELLO WORLD"} /> */}
        {/* <AnimationElement
          className={"box"}
          top="50%"
          left="50%"
          width={1.0}
          height={1.0}
        > */}
        <div className={"box"}>
          <Nbc1Document />
        </div>
        {/* </AnimationElement> */}
      </Scene>
    </AnimatedPlayer>
  )
}
