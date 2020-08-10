export const highlight = (startTime: number, endTime: number, transitionTime?: number) => {
    return {
        [startTime]: {
            "background-position": "0% 0",
            transition: `${transitionTime ?? 0.5}s ease-in-out`
        },
        [endTime]: {
            "background-position": "-100% 0",

        }
    }
}