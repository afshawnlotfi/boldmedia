// @ts-ignore
import svgr from "@svgr/core"
import {
  exists,
  mkdir,
  readFileSync,
  unlinkSync,
  writeFile,
  writeFileSync
} from "fs"
import fetch from "node-fetch"
import { camelCase, capitalize } from "../utils"
import { convertToSvgPath } from "./svg-helpers"

const ICON_PATH = `${process.cwd()}/src/icons`
const ICON_TYPES_PATH = `${ICON_PATH}/icons.ts`
const ICON_JSON_PATH = `${ICON_PATH}/icons.json`
const ICON_COMPONENT_PATH = `${ICON_PATH}/components`

export interface IconAttribution { author: string | null, type: "Flaticon" | "Material" | "Ionicons" | "Custom" }
export interface IconEntry {
  attribution: IconAttribution
  url: string
}

const checkFiles = (onFinish: () => void) => {
  exists(ICON_PATH, (iconPathExists) => {
    if (!iconPathExists) {
      mkdir(ICON_PATH, (e) => {
        if (e) {
          throw new Error(`failed to create directory ${ICON_PATH}`)
        }
        mkdir(ICON_COMPONENT_PATH, (e) => {
          if (e) {
            throw new Error(`failed to create directory ${ICON_COMPONENT_PATH}`)
          }
          writeFile(ICON_JSON_PATH, "{}", () => {
            onFinish()
          })
        })
      })
    } else {
      onFinish()
    }
  })
}

const getSvgUrl = (url: string) => {
  const flatIconRegex = /^https:\/\/www\.flaticon\.com\/free-icon\/([a-zA-Z_]*)([0-9]*)?(.*)$/gm
  const flatIconMatches = flatIconRegex.exec(url)
  if (flatIconMatches) {
    const svgId = flatIconMatches[2]
    const svgIdLength = svgId.length
    let group =
      svgIdLength > 3 ? svgId.substring(0, svgIdLength - 3) ?? "" : "0"
    return `https://image.flaticon.com/icons/svg/${group}/${svgId}.svg`
  } else if (url.endsWith(".svg") || url.includes("fonts.gstatic.com")) {
    return url
  } else {
    throw new Error("invalid svg url")
  }
}

const convertSVGToReact = async (svg: string, name: string) => {
  const tsCode: string = await svgr(
    svg,
    { icon: true, replaceAttrValues: { "1em": "100%" }, typescript: true },
    { componentName: `Svg${capitalize(camelCase(name))}` }
  )
  return tsCode
}

const downloadSVG = async (sourceUrl: string) => {
  const url = getSvgUrl(sourceUrl)
  const svgFetch = await fetch(url)
  const fetchedSvg = await svgFetch.text()
  const svg = await convertToSvgPath(fetchedSvg)
  return { svg, url }
}

const getAttribution = async (url: string): Promise<IconAttribution> => {
  if (url.includes("flaticon.com")) {
    const authorRegex = /"author": "(.*)"/gm
    const flatIconFetch = await fetch(url)
    const flatIconHtml = await flatIconFetch.text()
    const authorRegexMatch = authorRegex.exec(flatIconHtml)
    if (authorRegexMatch && authorRegexMatch[1]) {
      const author = authorRegexMatch[1]
      return { author, type: "Flaticon" }
    } else {
      return { author: null, type: "Flaticon" }
    }
  } else if (url.includes("fonts.gstatic.com")) {
    return { author: "Material", type: "Material" }
  } else if (url.includes("unpkg.com/ionicons")) {
    return { author: "Ionicons", type: "Ionicons" }
  } else {
    return { author: null, type: "Custom" }
  }
}

const loadIconEntries = () => {
  const iconsRawData = readFileSync(ICON_JSON_PATH, { encoding: "utf8" })
  return JSON.parse(iconsRawData) as { [key: string]: IconEntry }
}

const updateTypeDefs = () => {
  const iconEntries = loadIconEntries()
  const types = Object.keys(iconEntries)
  writeFileSync(
    ICON_TYPES_PATH,
    types.length > 0
      ? `export type AnimatedIconType = "${types.join('" | "')}"`
      : ""
  )
}

const updateCode = (code: string | null, name: string) => {
  if (code) {
    writeFileSync(`${ICON_COMPONENT_PATH}/${name}.tsx`, code)
  } else {
    unlinkSync(`${ICON_COMPONENT_PATH}/${name}.tsx`)
  }
}

const updateIconEntry = (entry: IconEntry | null, name: string) => {
  const iconEntries = loadIconEntries()
  if (entry) {
    if (iconEntries[name]) {
      throw new Error(`icon with name ${name} already exists`)
    }
    iconEntries[name] = entry
  } else {
    delete iconEntries[name]
  }

  writeFile(ICON_JSON_PATH, JSON.stringify(iconEntries, null, 4), () => {
    updateTypeDefs()
  })
}

export const addIcon = (source: string, name: string) => {
  checkFiles(async () => {
    const { url, svg } = await downloadSVG(source)
    const code = await convertSVGToReact(svg, name)
    updateCode(code, name)
    const attribution = await getAttribution(source)

    updateIconEntry(
      {
        attribution,
        url,
      },
      name
    )
  })
}

export const removeIcon = (name: string) => {
  checkFiles(async () => {
    updateCode(null, name)
    updateIconEntry(null, name)
  })
}
