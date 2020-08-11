import { readFileSync } from "fs"
// @ts-ignore
import { parse, stringify } from "himalaya"
import { capitalize } from "../utils"

interface HtmlElement {
  type: string
  tagName: string
  attributes: { key: string; value: string }[]
  children: HtmlElement[]
}

const kvsToObject = (kvs: { key: string; value: string }[]) => {
  const object: { [key: string]: string } = {}
  kvs.forEach(({ key, value }) => {
    object[key] = value
  })
  return object
}

const conversion = (element: HtmlElement, children: HtmlElement[]) => {
  const updatedElement = { ...element }
  updatedElement.attributes = element.attributes.map(({ key, value }) => {
    switch (key) {
      case "class":
        return { key: "className", value }
      case "style":
        const styles = value.split(";")

        const newValue =
          "{" +
          JSON.stringify(
            kvsToObject(
              styles
                .filter((style) => /\S/.test(style))
                .map((style) => {
                  const filtered = style.replace("\n", "").trim()
                  const cssMatches = filtered.split(":")
                  const cssKey = cssMatches[0]
                  const cssValue = cssMatches[1].trim()
                  if (!!cssKey && !!cssValue) {
                    const newCssKey = cssKey
                      .split("-")
                      .map((styleSub, i) => {
                        return i > 0 ? capitalize(styleSub) : styleSub
                      })
                      .join("")
                    return { key: newCssKey, value: cssValue }
                  }
                  throw new Error(`malformed style: ${style}`)
                })
            )
          ) +
          "}"

        return { key, value: newValue }
      default:
        return { key, value }
    }
  })
  return { ...updatedElement, children }
}

const convertToPath = (nodes: HtmlElement[]): HtmlElement[] => {
  return nodes.map((node) => {
    if (node.children) {
      const children =
        node.children.length > 0 ? convertToPath(node.children) : node.children
      return conversion(node, children)
    } else {
      return node
    }
  })
}

const convertToJSX = () => {
  const name = "article"
  const html = readFileSync(`../${name}/${name}.html`, { encoding: "utf8" })
  const json: HtmlElement[] = parse(html)
  const body = json
    .filter((el: HtmlElement) => el.tagName === "html")[0]
    ?.children.filter((el: HtmlElement) => el.tagName === "body")[0]
  if (body) {
    // console.log(body.children)
    const stringified = stringify(convertToPath(body.children)) as string
    const quoteRemoved = stringified
      .replace(/'{{/gm, "{{")
      .replace(/}}'/gm, "}}")

    const imgCorrected = quoteRemoved.replace(/(<img[^\/]*?>)/gm, (x) => {
      return x.replace(/>$/gm, "/>").replace(/src='(.*)'/gm, (y) => {
        return `src={require("./${y}")}`
      })
    })

    const template = `import React from "react"
    import "./base.min.css"
    import "./fancy.min.css"
    import "./${name}.css"
    
    
    export interface ${capitalize(name)}DocumentProps {}
    
    export const ${capitalize(
      name
    )}Document: React.FC<ArticleDocumentProps> = () => {
      return (
        <div>
          ${imgCorrected}
        </div>
      )
    }`
    console.log(template)
  }
}

convertToJSX()
