// import { AnimatedIcon } from "./components/animated-icon"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"

const useStyles = makeStyles(() => ({
  "@keyframes textTransition": {
    "0%": {
      width: "0%",
    },
    "100%": {
      width: "100%",
    },
  },

  textBlock: {
    display: "inline-block",
    padding: 2,
  },

  textBlockAnimation: {
    textAlign: "center",
    animationName: "$textTransition",
    animationFillMode: "forwards",
    whiteSpace: "nowrap",
  },
}))

export interface BaseLineTextEffect {
  title: string
  subtitle?: string
}

export interface BlockTextEffectProps extends BaseLineTextEffect {
  animationDuration?: string
  backgroundColor?: "black"
  color?: "white"
}

export const BlockTextEffect: React.FC<BlockTextEffectProps> = ({
  animationDuration = "1s",
  color = "white",
  backgroundColor = "black",
  title,
  subtitle,
}) => {
  const classes = useStyles()
  return (
    <div>
      <div className={classes.textBlock}>
        <div
          className={classes.textBlockAnimation}
          style={{
            animationDuration,
            color,
            backgroundColor,
            height: 50,
            fontSize: 37,
          }}
        >
          <div style={{ padding: 4 }}>{title}</div>
        </div>
      </div>
      <br />
      {subtitle && (
        <div className={classes.textBlock}>
          <div
            className={classes.textBlockAnimation}
            style={{
              animationDuration,
              color,
              backgroundColor,
              height: 30,
              fontSize: 20,
            }}
          >
            <div style={{ padding: 4 }}>{subtitle}</div>
          </div>
        </div>
      )}
    </div>
  )
}
