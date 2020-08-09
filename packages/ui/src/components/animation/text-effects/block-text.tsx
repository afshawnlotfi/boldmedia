// import { AnimatedIcon } from "./components/animated-icon"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"

const useStyles = makeStyles(() => ({

  textBlock: {
    display: "inline-block",
  },

  text: {
    textAlign: "center",
    whiteSpace: "nowrap",
  },
}))

export interface BaseLineTextEffect {
  title: string
}

export interface BlockTextEffectProps extends BaseLineTextEffect {
  backgroundColor?: string
  color?: string
  fontSize?: string | number
}

export const BlockTextEffect: React.FC<BlockTextEffectProps> = ({
  color = "white",
  backgroundColor = "black",
  title,
  fontSize = "4vh"
}) => {
  const classes = useStyles()
  return (
    <div className={classes.textBlock}>
      <div
        style={{
          color,
          backgroundColor,
          fontSize
        }}
        className={classes.text}
      >
        <div style={{ padding: 4 }}>{title}</div>
      </div>
    </div>
  )
}
