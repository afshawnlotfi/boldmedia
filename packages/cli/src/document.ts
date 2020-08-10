import yargs from "yargs"
import { addIcon, removeIcon } from "./helpers/icon-helpers"

export const documentWebsiteAddArgs = (argv: yargs.Argv) =>
  argv.options({
    source: {
      type: "string",
      alias: "s",
      demandOption: true,
      describe: "source url of pdf",
    },
    name: {
      type: "string",
      alias: "n",
      demandOption: true,
      describe: "name icon",
    },
  })

export const documentWebsiteAddHandler = ({
  source,
  name,
}: {
  source: string
  name: string
}) => {
  addIcon(source, name)
}

export const documentPdfAddArgs = (argv: yargs.Argv) =>
  argv.options({
    source: {
      type: "string",
      alias: "s",
      demandOption: true,
      describe: "source url of pdf",
    },
    name: {
      type: "string",
      alias: "n",
      demandOption: true,
      describe: "name icon",
    },
  })

export const documentPdfAddHandler = ({
  source,
  name,
}: {
  source: string
  name: string
}) => {
  addIcon(source, name)
}

export const documentImageAddArgs = (argv: yargs.Argv) =>
  argv.options({
    source: {
      type: "string",
      alias: "s",
      demandOption: true,
      describe: "source url of pdf",
    },
    name: {
      type: "string",
      alias: "n",
      demandOption: true,
      describe: "name icon",
    },
  })

export const documentImageAddHandler = ({
  source,
  name,
}: {
  source: string
  name: string
}) => {
  addIcon(source, name)
}

export const documentRemoveArgs = (argv: yargs.Argv) =>
  argv.options({
    name: {
      type: "string",
      alias: "n",
      demandOption: true,
      describe: "name icon",
    },
  })

export const documentRemoveHandler = ({ name }: { name: string }) => {
  removeIcon(name)
}
