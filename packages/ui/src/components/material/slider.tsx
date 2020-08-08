import Grid from "@material-ui/core/Grid"
import Input from "@material-ui/core/Input"
import Slider from "@material-ui/core/Slider"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import React, { useEffect } from "react"

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    marginBottom: 30,
    width: 100,
  },
})

export interface InputSliderProps {
  title: string
  onUpdate?: (value: number) => void
  initial?: number
}

export const InputSlider: React.FC<InputSliderProps> = ({
  title,
  onUpdate,
  initial,
}) => {
  const classes = useStyles()
  const [value, setValue] = React.useState<number | string>(
    initial !== undefined ? initial : 30
  )

  useEffect(() => {
    if (onUpdate) {
      onUpdate(typeof value === "number" ? value : parseFloat(value))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleSliderChange = (_: any, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value))
  }

  // const handleBlur = () => {
  //   if (value < 0) {
  //     setValue(0)
  //   } else if (value > 100) {
  //     setValue(100)
  //   }
  // }

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item></Grid>
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            min={0}
            step={10}
            max={500}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            inputProps={{
              step: 10,
              min: 0,
              max: 500,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}
