export function camelCase(input: string) {
  return input.toLowerCase().replace(/-(.)/g, function (_, group1) {
    return group1.toUpperCase()
  })
}

export function capitalize(input: string) {
  return input[0].toUpperCase() + input.substr(1)
}

export function dashToCamelCase(input: string) {
  return input
    .split("-")
    .map((sub, i) => {
      return i > 0 ? capitalize(sub) : sub
    })
    .join("")
}
