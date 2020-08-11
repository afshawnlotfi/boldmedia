import yargs from "yargs"
import { addDocument, removeDocument } from "./helpers/document-helpers"

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
  addDocument({name, url : source, type : "website"})
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
  addDocument({name, url : source, type : "pdf"})
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
  addDocument({name, url : source, type : "img"})
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
  removeDocument(name)
}
