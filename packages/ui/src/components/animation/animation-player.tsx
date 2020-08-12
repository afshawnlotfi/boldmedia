import { IconButton, makeStyles } from "@material-ui/core"
import PauseIcon from "@material-ui/icons/Pause"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import React from "react"
import { Scene } from "react-scenejs"

const useStyles = makeStyles({
  root: {},

  content: {
    position: "relative",
  },

  player: {
    top: "90%",
    position: "absolute",
    height: 100,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },

  playerSlider: {
    flex: 1,
  },

  playerControls: {},
})

export interface AnimatedPlayerProps {
  sceneEl?: Scene
  isPlaying: boolean
  children: JSX.Element
  setInputEl?: (el: HTMLInputElement | null) => void
}

export const AnimatedPlayer: React.FC<AnimatedPlayerProps> = ({
  sceneEl,
  children,
  setInputEl,
  isPlaying,
}) => {
  const classes = useStyles()
  const isRecording = true

  return (
    <div className={classes.root}>
      <div className={classes.content}>{children}</div>
      {!isRecording && (
        <div className={classes.player}>
          {!isPlaying ? (
            <IconButton
              className={classes.playerControls}
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
              className={classes.playerControls}
              onClick={() => {
                if (sceneEl) {
                  sceneEl.isPaused() ? sceneEl.play() : sceneEl.pause()
                }
              }}
            >
              <PauseIcon />
            </IconButton>
          )}

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
      )}
    </div>
  )
}
