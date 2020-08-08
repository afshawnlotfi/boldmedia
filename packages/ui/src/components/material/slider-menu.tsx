import React, { useEffect, useState } from "react"
import { InputSlider } from "./slider"

export interface SliderMenuProps {
  properties: string[]
  onUpdate?: (values: { [key: string]: number }) => void
  initials: number[]
}

export const SliderMenu: React.FC<SliderMenuProps> = ({
  properties,
  onUpdate,
  initials,
}) => {
  const [values, changeValues] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (onUpdate) {
      if (Object.keys(values).length > 0) {
        onUpdate(values)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <div>
      {properties.map((property, i) => {
        return (
          <InputSlider
            key={property}
            title={property}
            initial={initials[i]}
            onUpdate={(value) => {
              changeValues((old) => {
                return { ...old, [property]: value }
              })
            }}
          />
        )
      })}
    </div>
  )
}
