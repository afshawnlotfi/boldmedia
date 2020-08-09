import { IconButton, makeStyles } from "@material-ui/core"
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import React from "react"
import { Scene } from "react-scenejs"

const useStyles = makeStyles({

    root: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
    },


    player: {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        flex: 0.1,
    },

    playerSlider: {
        display: "inline-block",
        verticalAlign: "middle",
        flex: 1,
    },

    playerControls: {
        paddingRight: 20
    },


})


export interface AnimatedPlayerProps {
    sceneEl?: Scene
    isPlaying: boolean
    children: JSX.Element
    setInputEl?: (el: HTMLInputElement | null) => void
}

export const AnimatedPlayer: React.FC<AnimatedPlayerProps> = ({ sceneEl, children, setInputEl, isPlaying }) => {

    const classes = useStyles()
    const isRecording = true

    return (
        <div className={classes.root}>
            <div style={{ width: "100%", height: "100%" }}>
                {children}

            </div>
            {
                isRecording && (
                    <div className={classes.player}>
                        <div className={classes.playerControls}>
                            {!isPlaying ? (
                                <IconButton
                                    onClick={() => {
                                        if (sceneEl) {
                                            sceneEl.isPaused() ? sceneEl.play() : sceneEl.pause()
                                        }
                                    }}
                                >
                                    <PlayArrowIcon />
                                </IconButton>
                            ) : (
                                    <IconButton
                                        onClick={() => {
                                            if (sceneEl) {
                                                sceneEl.isPaused() ? sceneEl.play() : sceneEl.pause()
                                            }
                                        }}
                                    >
                                        <PauseIcon />
                                    </IconButton>


                                )}
                        </div>

                        <input
                            ref={(el) => {
                                if (setInputEl) {
                                    setInputEl(el)
                                }
                            }}
                            className={classes.playerSlider}
                            type="range"
                            defaultValue="0"
                            min="0"
                            max="100"
                            onInput={(e) => {
                                if (sceneEl) {
                                    sceneEl.pause()
                                    sceneEl.setTime(e.currentTarget.value + "%")
                                }
                            }}
                        />
                    </div>
                )

            }

        </div>
    )
}
