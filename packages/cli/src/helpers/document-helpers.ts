import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer"
import { exec } from "child_process"
import fetch from "cross-fetch"
import { exists, mkdir, writeFile } from "fs"
import puppeteer from "puppeteer"

// const BASE_PATH = process.cwd()
const TMP_PDF_DIR = "/tmp/pdfs"
const TMP_ARCHIVE_DIR = "/tmp/archive"
const TMP_PDF_PATH = (name: string) => `${TMP_PDF_DIR}/${name}.pdf`
const TMP_ARCHIVE_PATH = (name: string) => `${TMP_ARCHIVE_DIR}/${name}`

const checkFiles = (onFinish: () => void) => {
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

export interface FetchDocumentProps {
  url: string
  name: string
  type: "website" | "pdf" | "img"
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

export const fetchDocument = (props: FetchDocumentProps) => {
  const onFinish = (pdfPath: string) => {
    const archivePath = TMP_ARCHIVE_PATH(props.name)
    exec(
      `pdf2htmlEX --embed cfijo --dest-dir ${archivePath} ${pdfPath}`,
      (err, stdout, _) => {
        if (err) {
          return
        }
        console.log(stdout)
      }
    )
  }
  checkFiles(() => {
    switch (props.type) {
      case "img":
      case "pdf":
        return fetchPdfImg(props, onFinish)
      case "website":
        return fetchWebsite(props, onFinish)
    }
  })
}

fetchDocument({
  name: "article",
  url:
    "https://www.reuters.com/article/us-lebanon-security-blast-resignation/lebanon-government-resigns-after-deadly-beirut-blast-idUSKCN256258",
  type: "website",
})
