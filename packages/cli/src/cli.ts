#!/usr/bin/env node
import yargs from "yargs"
import {
  iconAddArgs,
  iconAddHandler,
  iconRemoveArgs,
  iconRemoveHandler,
} from "./icon"

let argv = yargs.command("icon", "icon service", (yargs: yargs.Argv) => {
  return yargs
    .command("add", "add icon service", (argv: yargs.Argv) => {
      return iconAddArgs(argv)
    })
    .command("remove", "remove icon service", (argv: yargs.Argv) => {
      return iconRemoveArgs(argv)
    })
}).argv

const handle = (argv: { _: string[] }) => {
  const operations = argv._.reverse()
  switch (operations.pop()) {
    case "icon":
      switch (operations.pop()) {
        case "add":
          return iconAddHandler(argv as any)
        case "remove":
          return iconRemoveHandler(argv as any)
      }
  }
}

handle(argv)
