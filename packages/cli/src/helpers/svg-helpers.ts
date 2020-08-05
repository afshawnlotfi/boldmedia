// @ts-ignore
import toPath from "element-to-path"
import { INode, parse, stringify } from "svgson"

const conversion = (element: INode, children: INode[]) => {
  return [
    "rect",
    "circle",
    "ellipse",
    "line",
    "polyline",
    "polygon",
    "path",
  ].includes(element.name)
    ? {
        name: "path",
        type: "element",
        value: "",
        attributes: {
          d: toPath(element),
        },
        children,
      }
    : { ...element, children }
}

const convertToPath = (nodes: INode[]): INode[] => {
  return nodes.map((node) => {
    const children =
      node.children.length > 0
        ? convertToPath(node.children)
        : node.children
    const newNode = conversion(node, children)
    return newNode
  })
}

export const removeSvg = (svg: string) => {
  let newSvg = svg
  const remove = [`d="M0 0h24v24H0z"`]
  remove.forEach((item) => {
    newSvg = newSvg.replace(item, "")
  })
  return newSvg
}

export const convertToSvgPath = async (svg: string) => {
  const json = await parse(svg)
  json.children = convertToPath(json.children)
  return removeSvg(stringify(json))
}
