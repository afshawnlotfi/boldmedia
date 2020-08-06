import TWEEN from "@tweenjs/tween.js"
import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import * as THREE from "three"
import { CSS3DObject, CSS3DRenderer } from "three-css3drenderer"
import { ChartComponent } from "./chart"
export interface ThreeStageProps {}

const Element = (id: string, x: number, y: number, z: number, ry: number) => {
  // const div = document.createElement("div")
  // div.style.width = "480px"
  // div.style.height = "360px"
  // div.style.backgroundColor = "#000"
  // const iframe = document.createElement("iframe")
  // iframe.style.width = "480px"
  // iframe.style.height = "360px"
  // iframe.style.border = "0px"
  // iframe.src = ["https://www.youtube.com/embed/", id, "?rel=0"].join("")
  // div.appendChild(iframe)
  console.log(id)
  const element = document.createElement("div")
  ReactDOM.render(<ChartComponent />, element)

  element.style.width = "100vw"
  element.style.height = "100vh"

  // @ts-ignore
  const object: THREE.Object3D = new CSS3DObject(element)
  object.position.set(x, y, z)
  object.rotation.y = ry
  return object
}

export const ThreeStage: React.FC<ThreeStageProps> = () => {
  // const mesh = useRef()
  const coords = { x: 1500, y: 0 } // Start at (0, 0)

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    5000
  )
  const scene = new THREE.Scene()
  // @ts-ignore
  const renderer = new CSS3DRenderer()

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  const animate = (time: number) => {
    requestAnimationFrame(animate)
    TWEEN.update(time)

    // controls.update()
    renderer.render(scene, camera)
  }

  useEffect(() => {
    var container = document.getElementById("container")

    camera.position.set(0, 0, 1500)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.top = 0
    if (container) {
      container.appendChild(renderer.domElement)
    }
    var group = new THREE.Group()
    group.add(Element("Vvvicd07zCs", 0, 0, 240, 0))

    scene.add(group)
    // controls.rotateSpeed = 4
    window.addEventListener("resize", onWindowResize, false)

    new TWEEN.Tween(coords)
      .to({ x: 1800, y: 200 }, 2000)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        camera.position.set(0, 0, coords.x)
      })
      .start(1000)
    requestAnimationFrame(animate)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div id="container"></div>
    </div>
  )
}
