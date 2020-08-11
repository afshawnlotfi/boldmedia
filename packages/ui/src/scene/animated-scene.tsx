import React, { useState } from "react"
import { Scene } from "react-scenejs"
import { AnimatedPlayer } from "../components/animation/animation-player"
import { Article } from "../documents/article"
import { highlight } from "../effects/highlight"
import "./scene.css"

export const AnimatedScene = () => {
  const [isPlaying, changeIsPlaying] = useState(false)
  const [sceneEl, changeSceneEl] = useState<Scene>()
  const keyframes2 = {
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
        <Article />
        {/* <AnimationElement top="90%" left="10%" className={"textEx"}>
                    <BlockTextEffect title="Afshawn" />
                </AnimationElement> */}
      </Scene>
    </AnimatedPlayer>
  )
}
