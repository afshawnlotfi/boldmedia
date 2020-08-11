import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer"
import { exec } from "child_process"
import fetch from "cross-fetch"
import {
  copyFile,
  copyFileSync,
  exists,
  mkdir,
  readFile,
  readFileSync,
  unlinkSync,
  writeFile,
  writeFileSync,
} from "fs"
import { readdir } from "fs/promises"
import puppeteer from "puppeteer"
import { convertToJSX } from "./html-helpers"

// const BASE_PATH = process.cwd()
const TMP_PDF_DIR = "/tmp/pdfs"
const TMP_ARCHIVE_DIR = "/tmp/archive"
const TMP_PDF_PATH = (name: string) => `${TMP_PDF_DIR}/${name}.pdf`
const TMP_ARCHIVE_PATH = (name: string) => `${TMP_ARCHIVE_DIR}/${name}`

export interface DocumentEntry {
  type: "website" | "pdf" | "img"
  url: string
}

export interface FetchDocumentProps extends DocumentEntry {
  name: string
}

const DOCUMENT_PATH = `${process.cwd()}/src/documents`
const DOCUMENT_JSON_PATH = `${DOCUMENT_PATH}/documents.json`
const DOCUMENT_COMPONENT_PATH = `${DOCUMENT_PATH}/components`

const checkFiles = (onFinish: () => void) => {
  exists(DOCUMENT_PATH, (iconPathExists) => {
    if (!iconPathExists) {
      mkdir(DOCUMENT_PATH, (e) => {
        if (e) {
          throw new Error(`failed to create directory ${DOCUMENT_PATH}`)
        }
        mkdir(DOCUMENT_COMPONENT_PATH, (e) => {
          if (e) {
            throw new Error(
              `failed to create directory ${DOCUMENT_COMPONENT_PATH}`
            )
          }
          writeFile(DOCUMENT_JSON_PATH, "{}", () => {
            copyFile(
              `${__dirname}/../assets/base.min.css`,
              `${DOCUMENT_PATH}/base.min.css`,
              () => {
                copyFile(
                  `${__dirname}/../assets/fancy.min.css`,
                  `${DOCUMENT_PATH}/fancy.min.css`,
                  () => {
                    onFinish()
                  }
                )
              }
            )
          })
        })
      })
    } else {
      onFinish()
    }
  })
}

const checkTmpFiles = (onFinish: () => void) => {
  exec(`rm -rf ${TMP_PDF_DIR}`, () => {
    exec(`rm -rf ${TMP_ARCHIVE_DIR}`, () => {
      exists(TMP_PDF_DIR, (pdfPath) => {
        if (!pdfPath) {
          mkdir(TMP_PDF_DIR, (e) => {
            if (e) {
              throw new Error(`failed to create directory ${TMP_PDF_DIR}`)
            }
            exists(TMP_ARCHIVE_DIR, (archivePath) => {
              if (!archivePath) {
                mkdir(TMP_ARCHIVE_DIR, (e) => {
                  if (e) {
                    throw new Error(
                      `failed to create directory ${TMP_ARCHIVE_DIR}`
                    )
                  }
                  onFinish()
                })
              } else {
                onFinish()
              }
            })
          })
        } else {
          onFinish()
        }
      })
    })
  })
}

const fetchWebsite = async (
  { url, name }: FetchDocumentProps,
  onFinished?: (path: string) => void
) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  })

  const page = await browser.newPage()
  const blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch)
  blocker.enableBlockingInPage(page)
  await page.goto(url)

  const pdf = await page.pdf({
    format: "Letter",
    displayHeaderFooter: false,
    printBackground: true,

    margin: { top: 37, bottom: 37, left: 37, right: 37 },
  })

  await browser.close()
  const path = TMP_PDF_PATH(name)

  writeFile(path, pdf, () => {
    if (onFinished) {
      onFinished(path)
    }
  })
}

const fetchPdfImg = async (
  { url, name }: FetchDocumentProps,
  onFinished?: (path: string) => void
) => {
  const path = TMP_PDF_PATH(name)
  exec(`wget ${url} -O ${path}`, (err, stdout, stderr) => {
    if (err) {
      return
    }

    if (onFinished && stdout) {
      onFinished(path)
    } else {
      throw new Error(stderr)
    }
  })
}

const loadDocumentEntries = () => {
  console.log("loading entries")
  const documentsRawData = readFileSync(DOCUMENT_JSON_PATH, {
    encoding: "utf8",
  })
  return JSON.parse(documentsRawData) as { [key: string]: DocumentEntry }
}

const updateDocumentEntry = (entry: DocumentEntry | null, name: string) => {
  const documentEntries = loadDocumentEntries()
  console.log(documentEntries)
  if (entry) {
    if (documentEntries[name]) {
      throw new Error(`icon with name ${name} already exists`)
    }
    documentEntries[name] = entry
  } else {
    delete documentEntries[name]
  }
  writeFileSync(DOCUMENT_JSON_PATH, JSON.stringify(documentEntries, null, 4))
}

export const addDocument = (props: FetchDocumentProps) => {
  const onFinish = (pdfPath: string) => {
    const name = props.name
    const archivePath = TMP_ARCHIVE_PATH(name)
    console.log("converting to html")
    exec(
      `pdf2htmlEX --embed cfijo --dest-dir ${archivePath} ${pdfPath}`,
      (err, _, __) => {
        if (err) {
          return
        }
        console.log("converting to jsx components")
        readFile(
          `${archivePath}/${name}.html`,
          { encoding: "utf8" },
          (_, html) => {
            const jsx = convertToJSX({ html, name })

            updateDocumentEntry(
              { type: props.type, url: props.url },
              props.name
            )
            mkdir(`${DOCUMENT_COMPONENT_PATH}/${name}`, () => {
              writeFile(
                `${DOCUMENT_COMPONENT_PATH}/${name}/${name}.tsx`,
                jsx,
                { encoding: "utf8" },
                async () => {
                  const files = await readdir(archivePath)
                  files
                    .filter((file) => {
                      return !(
                        ["base.min.css", "fancy.min.css"].includes(file) ||
                        file.endsWith(".html") ||
                        file.endsWith(".js") ||
                        file.endsWith(".outline")
                      )
                    })
                    .forEach((file) => {
                      copyFileSync(
                        `${archivePath}/${file}`,
                        `${DOCUMENT_COMPONENT_PATH}/${name}/${file}`
                      )
                    })
                }
              )
            })
          }
        )
      }
    )
  }
  checkTmpFiles(() => {
    checkFiles(() => {
      switch (props.type) {
        case "img":
        case "pdf":
          console.log("fetching pdf/img")
          return fetchPdfImg(props, onFinish)
        case "website":
          console.log("fetching website")
          return fetchWebsite(props, onFinish)
      }
    })
  })
}

export const removeDocument = (name: string) => {
  checkFiles(async () => {
    unlinkSync(`${DOCUMENT_COMPONENT_PATH}/${name}.tsx`)
    updateDocumentEntry(null, name)
  })
}
