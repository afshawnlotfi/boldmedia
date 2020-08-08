import ReactDOM from "react-dom"
import { CSS3DObject } from "three-css3drenderer"

export const ThreeDiv = (
  element: JSX.Element,
  x: number,
  y: number,
  z: number,
  ry: number
) => {
  const div = document.createElement("div")

  div.addEventListener("click", (event) => {
    const bounds = (event.target as any)?.getBoundingClientRect()

    const { x, y } = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    }
    console.log(x, y)
  })
  ReactDOM.render(element, div)
  const object = new CSS3DObject(div)
  object.position.set(x, y, z)
  object.rotation.y = ry
  return object
}
