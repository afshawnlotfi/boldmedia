// @ts-ignore
import { parse, stringify } from "himalaya"
import prettier from "prettier"
import { capitalize, dashToCamelCase } from "../utils"

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
                    const newCssKey = dashToCamelCase(cssKey)
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

export const convertToJSX = ({
  html,
  name,
}: {
  html: string
  name: string
}) => {
  const json: HtmlElement[] = parse(html)
  const body = json
    .filter((el: HtmlElement) => el.tagName === "html")[0]
    ?.children.filter((el: HtmlElement) => el.tagName === "body")[0]
  if (body) {
    const converted = convertToPath(body.children)
    const pageComponents = converted
      .filter(
        (el) => el.attributes && el.attributes[0]?.value === "page-container"
      )[0]
      ?.children.filter((el) => el.type === "element")
    let code = `import React from "react"
    import "./${name}.css"`

    pageComponents.forEach((pageComponent, i) => {
      const stringified = stringify([pageComponent]) as string
      const quoteRemoved = stringified
        .replace(/'{{/gm, "{{")
        .replace(/}}'/gm, "}}")

      const imgCorrected = quoteRemoved.replace(/(<img[^\/]*?>)/gm, (x) => {
        return x.replace(/>$/gm, "/>").replace(/src='(.*)'/gm, (y) => {
          const matches = /src='(.*)'/gm.exec(y)
          if (matches && matches[1]) {
            return `src={require("./${matches[1]}")}`
          }
          throw new Error("img file match error")
        })
      })

      const className = capitalize(dashToCamelCase(name))
      code += `
      
      
      export interface ${className}${i}DocumentProps {}
      
      export const ${className}${i}Document: React.FC<${capitalize(
        name
      )}${i}DocumentProps> = () => {
        return (
          <div>
            ${imgCorrected}
          </div>
        )
      }`
    })

    const formatted = prettier.format(code, { semi: false, parser: "babel" })
    return formatted
  }
  throw new Error("HTML does not have a <body> tag")
}
