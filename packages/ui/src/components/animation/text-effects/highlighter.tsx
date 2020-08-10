import { makeStyles } from "@material-ui/core"
import React from "react"
import { classNames } from "../../../utils"

const useStyles = makeStyles({
  onHover: {
    backgroundPosition: "-100% 0",
  },

  title: {
    background:
      "linear-gradient(to right, rgba(255, 255, 255, 0) 50%, rgb(255,253,71) 50%)",
    backgroundSize: "200%",
    display: "inline",
  },
})

export interface HighlighterProps {
  className: string
  text: string
  style?: React.CSSProperties
}

export const Highlighter: React.FC<HighlighterProps> = ({
  className,
  text,
  style,
}) => {
  const classes = useStyles()
  return (
    <h1 style={style} className={classNames(classes.title, className)}>
      {text}
    </h1>
  )
}
