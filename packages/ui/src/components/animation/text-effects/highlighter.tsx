import { makeStyles } from "@material-ui/core";
import React from "react";
import { classNames } from "../../../utils";

const useStyles = makeStyles({

  onHover: {
    backgroundPosition: "-100% 0"
  },

  title: {
    background: "linear-gradient(to right, rgba(255, 255, 255, 0) 50%, #16a085 50%)",
    backgroundSize: "200%",
    display: "inline",
  }

})

export interface HighlighterProps {
  className: string
}

export const Highlighter: React.FC<HighlighterProps> = ({ className }) => {
  const classes = useStyles()
  return (
    <h1 className={classNames(classes.title, className)}>
      This text will be highlighted when hovered
    </h1>


  )
}
