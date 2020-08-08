import { makeStyles } from "@material-ui/core"
import TWEEN from "@tweenjs/tween.js"
import React, { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { CSS3DRenderer } from "three-css3drenderer"
import { SliderMenu } from "./material/slider-menu"
import { ThreeDiv } from "./view-frame"

const useStyles = makeStyles({
  sliderBox: {
    padding: 10,
    left: "85%",
    top: "70%",
    zIndex: 1000,
    position: "absolute",
    width: "500",
    height: "500",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
})

interface Vector3D {
  x: number
  y: number
  z: number
  [key: string]: number
}

export interface ThreeStageProps {
  children: JSX.Element
}

export const ThreeStage: React.FC<ThreeStageProps> = ({ children }) => {
  const containerRef = useRef(null)
  const classes = useStyles()
  const coords: Vector3D = { x: 0, y: 0, z: 90 }
  const [div, changeDiv] = useState<any>()

  const { camera, scene, renderer, cameraZ } = useMemo(() => {
    return {
      camera: new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        5000
      ),
      scene: new THREE.Scene(),
      renderer: new CSS3DRenderer(),
      cameraZ: window.innerWidth * 0.5,
    }
  }, [])


  useEffect(() => {
    
  })

  useEffect(() => {
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const animate = (time?: number) => {
      requestAnimationFrame(animate)
      TWEEN.update(time ?? 0)
      renderer.render(scene, camera)
    }

    const container: any = containerRef.current
    if (container) {
      camera.position.set(0, 0, cameraZ)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.domElement.style.position = "absolute"
      renderer.domElement.style.top = 0
      container.appendChild(renderer.domElement)
      var group = new THREE.Group()

      if (!Array.isArray(children)) {
        const object = ThreeDiv(children, 0, 0, 0, 0)
        changeDiv(object.element)
        group.add(object)
      }

      scene.add(group)
      window.addEventListener("resize", onWindowResize, false)
      animate()
    }
  }, [camera, cameraZ, children, renderer, scene])

  return (
    <div>
      <div className={classes.sliderBox}>
        <SliderMenu
          properties={["x", "y", "z"]}
          initials={[coords.x, coords.y, coords.z]}
          onUpdate={(updated) => {
            ;(new TWEEN.Tween(coords)
              .to(updated, 1000)
              .easing(TWEEN.Easing.Quadratic.Out)
              .onUpdate(() => {
                div.style.setProperty("width", `${coords.z}vw`)
                div.style.setProperty("height", `${coords.z}vh`)
                camera.position.set(coords.x, coords.y, cameraZ)
              }) as any).start()
          }}
        />
      </div>
      <div ref={containerRef} />
    </div>
  )
}
