#!/usr/bin/env node
import yargs from "yargs"
import {
  documentImageAddArgs,
  documentImageAddHandler,
  documentPdfAddArgs,
  documentPdfAddHandler,
  documentRemoveArgs,
  documentRemoveHandler,
  documentWebsiteAddArgs,
  documentWebsiteAddHandler,
} from "./document"
import {
  iconAddArgs,
  iconAddHandler,
  iconRemoveArgs,
  iconRemoveHandler,
} from "./icon"

let argv = yargs
  .command("icon", "icon service", (yargs: yargs.Argv) => {
    return yargs
      .command("add", "add icon service", (yargs1: yargs.Argv) => {
        return iconAddArgs(yargs1)
      })
      .command("remove", "remove icon service", (yargs1: yargs.Argv) => {
        return iconRemoveArgs(yargs1)
      })
  })
  .command("document", "document service", (yargs: yargs.Argv) => {
    return yargs
      .command("add", "add document service", (yargs1: yargs.Argv) => {
        return yargs1
          .command(
            "website",
            "add document wesbite service",
            (yargs2: yargs.Argv) => {
              return documentWebsiteAddArgs(yargs2)
            }
          )
          .command("pdf", "add document pdf service", (yargs2: yargs.Argv) => {
            return documentPdfAddArgs(yargs2)
          })
          .command(
            "image",
            "add document image service",
            (yargs2: yargs.Argv) => {
              return documentImageAddArgs(yargs2)
            }
          )
      })
      .command("remove", "remove document service", (yargs1: yargs.Argv) => {
        return documentRemoveArgs(yargs1)
      })
  }).argv

const handle = (argv: any) => {
  const operations = argv._.reverse()
  switch (operations.pop()) {
    case "icon":
      switch (operations.pop()) {
        case "add":
          return iconAddHandler(argv)
        case "remove":
          return iconRemoveHandler(argv)
        default:
          return
      }
    case "document":
      switch (operations.pop()) {
        case "add":
          switch (operations.pop()) {
            case "website":
              return documentWebsiteAddHandler(argv)
            case "pdf":
              return documentPdfAddHandler(argv)
            case "image":
              return documentImageAddHandler(argv)
            default:
              return
          }

        case "remove":
          documentRemoveHandler(argv)
      }
  }
}

handle(argv)
