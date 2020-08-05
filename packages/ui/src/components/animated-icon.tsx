import { IconEntry } from "@boldmedia/cli/dist/helpers/icon-helpers"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import SvgLines from "react-mt-svg-lines"
import { AnimatedIconType } from "../icons/icons"

const useStyles = makeStyles(() => ({
  svg: {
    justifyContent: "center",
    padding: 30,
    backgroundColor: "black",
    width: 500,
    height: 500,
  },
}))

export interface AnimatedIconProps {
  props?: React.SVGProps<SVGSVGElement>
  duration?: number
  icon: AnimatedIconType
}

const icons = require("../icons/icons.json") as { [key: string]: IconEntry }

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  duration = 1000,
  icon,
  props = {},
}: AnimatedIconProps) => {
  const classes = useStyles()

  const defaultProps = {
    fill: "none",
    stroke: "white",
    strokeWidth: icons[icon].attribution.type === "Material" ? 0.15 : 3,
    ...props,
  }

  const Icon = require(`../icons/components/${icon}`).default

  return (
    <div className={classes.svg}>
      <SvgLines animate={true} duration={duration}>
        <Icon {...defaultProps} />
      </SvgLines>
    </div>
  )
}
