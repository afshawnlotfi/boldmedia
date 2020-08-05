import yargs from "yargs"
import { addIcon, removeIcon } from "./helpers/icon-helpers"

export const iconAddArgs = (argv: yargs.Argv) =>
  argv.options({
    source: {
      type: "string",
      alias: "s",
      demandOption: true,
      describe: "source url of icon",
    },
    name: {
      type: "string",
      alias: "n",
      demandOption: true,
      describe: "name icon",
    },
  })

export const iconAddHandler = ({
  source,
  name,
}: {
  source: string
  name: string
}) => {
  addIcon(source, name)
}

export const iconRemoveArgs = (argv: yargs.Argv) =>
  argv.options({
    name: {
      type: "string",
      alias: "n",
      demandOption: true,
      describe: "name icon",
    },
  })

export const iconRemoveHandler = ({ name }: { name: string }) => {
  removeIcon(name)
}
