import { kineticFrame } from "@scenejs/effects";



export const move = (startTime: number, endTime: number, left: number, top: number, rotate: number, scale: number) => {
    return {
        [`${startTime}, ${endTime}`]: kineticFrame({
            left: `${left}px`,
            top: `${top}px`
        }).set({
            transform: {
                rotate: `${rotate}deg`,
                scale
            }
        })
    }

}
