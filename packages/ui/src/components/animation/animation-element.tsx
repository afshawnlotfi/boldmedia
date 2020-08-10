import { makeStyles } from "@material-ui/core"
import React, { useMemo } from "react"
import { classNames } from "../../utils"



const useStyles = makeStyles({
    container: {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
    },

    element: {
        position: "absolute",
    }

})


export interface AnimationElementProps {
    children: JSX.Element
    className?: string
    width?: number,
    height?: number,
    left?: string
    top?: string
}

export const AnimationElement: React.FC<AnimationElementProps> = ({ children, className, width = 0.1, height = 0.05, left = "50%", top = "50%" }) => {
    const classes = useStyles()



    const cssSize = useMemo(() => {
        if (width > 1 || height > 1) {
            throw new Error("width and height are ratios of screen size between 0 and 1")
        }
        return { width: width * window.screen.width, height: height * window.screen.width }
    }, [height, width])

    return (
        <div style={{ ...cssSize, left, top }} className={classes.container}>
            <div style={{ width: "100%", height: cssSize.height }} className={classNames(className, classes.element)}>
                {children}
            </div>
        </div>
    )
}