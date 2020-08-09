
export const nestedIndex = (path: string) => {
  const indices = path.split(".").slice(1)
  const beforeIndex: string | undefined = indices[indices.length - 2]
  const lastIndex = indices[indices.length - 1]
  return { indices, lastIndex, beforeIndex }
}

export const removeIn = <T>(object: { [key: string]: T }, key: string) => {
  const copy = { ...object }
  delete copy[key]
  return copy
}

export const capitalize = (string: string, all: boolean = false) => {
  const regex = all ? /(?:^|\s)\S/g : /(?:^|\s)\S/
  return string.replace(regex, a => {
    return a.toUpperCase()
  })
}

const nested = <T>(object: { [key: string]: T }, path: string) => {
  const root = { ...object }
  const { indices, lastIndex, beforeIndex } = nestedIndex(path)
  //    @todo Make this more type safe
  return {
    root,
    previous: indices.slice(0, -1).reduce(
      // eslint-disable-next-line no-return-assign
      (acc, current) =>
        acc[current] !== undefined
          ? acc[current]
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc[current] = {} as any),
      root,
    ),
    lastIndex,
    beforeIndex,
  }
}

export const partition = <T>(array: T[], isValid: (element: T) => boolean) => {
  return array.reduce<T[][]>(
    ([p, f], e) => (isValid(e) ? [[...p, e], f] : [p, [...f, e]]),
    [[], []],
  )
}

export const setNested = <T>(
  object: { [key: string]: T },
  path: string,
  value: T,
) => {
  const { root, previous, lastIndex } = nested(object, path)
  previous[lastIndex] = value
  return root
}

export const removeNested = <T>(
  object: { [key: string]: T },
  path: string,
): { [key: string]: T } => {
  const { root, previous, lastIndex, beforeIndex } = nested(object, path)
  delete previous[lastIndex]

  if (Object.keys(previous).length === 0) {
    if (beforeIndex) {
      return removeNested<T>(root, `.${beforeIndex}`)
    }
  }
  return root
}

export const getNested = <T, C>(
  object: Partial<T>,
  path: string,
): C | undefined => {
  const { previous, lastIndex } = nested(object, path)
  // @ts-ignore
  return previous[lastIndex]
}


export const classNames = (...names: (string | undefined)[]) => {
  return names.filter((n) => !!n).join(" ")
}


/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export const getMobileOperatingSystem = (): "android" | "ios" | "unknown" => {
  // @ts-ignore
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;  

  if (/android/i.test(userAgent)) {
    return "android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "ios";
  }

  return "unknown";
};
