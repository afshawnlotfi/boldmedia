import { kineticFrame } from "@scenejs/effects"

export const move = (
  startTime: number,
  endTime: number,
  left: string,
  top: string,
  rotate: number,
  scale: number
) => {
  const frame = kineticFrame({
    left: `${left}`,
    top: `${top}`,
  }).set({
    transform: {
      rotate: `${rotate}deg`,
      scale,
    },
  })

  return {
    [startTime]: frame,
    [endTime]: frame,
  }
}
