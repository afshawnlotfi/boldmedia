import { makeStyles } from "@material-ui/core"
import React from "react"

const useStyles = makeStyles({
  highlighter: {
    backgroundColor: "yellow",
  },
})

export interface HighlighterProps {}

export const Highlighter: React.FC<HighlighterProps> = ({}) => {
  const classes = useStyles()
  return <div className={classes.highlighter}></div>
}
