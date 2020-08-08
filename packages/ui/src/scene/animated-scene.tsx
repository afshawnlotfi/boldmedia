import React, { useState } from "react"
import { Scene } from "react-scenejs"
import { AnimatedPlayer } from "../components/animation-player"
import "./App.css"


export const AnimatedScene = () => {
    const [isPlaying, changeIsPlaying] = useState(false)
    const [sceneEl, changeSceneEl] = useState<Scene>()

    const keyframes2 = {
        ".circles .circle": (i: number) => ({
            0: {
                "border-width": "150px",
                opacity: 1,
                transform: "translate(-50%, -50%) scale(0)",
            },
            2: { "border-width": "0px", opacity: 0.3, transform: "scale(0.7)" },
            options: {
                delay: i * 0.4,
            },
        }),
    }
    let inputEl: HTMLInputElement | null

    return (
        <AnimatedPlayer isPlaying={isPlaying} sceneEl={sceneEl} setInputEl={(el) => {
            inputEl = el
        }}>
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
                        inputEl.value = `${
                            (100 * e.time) / e.currentTarget.getDuration()
                            }`
                    }
                }}
                onPlay={() => {
                    changeIsPlaying(true)
                }}
                onPaused={() => {
                    changeIsPlaying(false)
                }}
            >

                <div className="circles">
                    <div className="circle circle1" />
                    <div className="circle circle2" />
                    <div className="circle circle3" />
                </div>
            </Scene>

        </AnimatedPlayer>


    )
}
