import React from 'react'
import { sortedColors } from '../colors'

export interface Props {
  color: string
  onColorSelect: (c: string) => void
}

export class ColorPalette extends React.Component<Props, any> {
  paletteColors: string[]

  constructor(props) {
    super(props)
    this.paletteColors = sortedColors
    this.onColorSelect = this.onColorSelect.bind(this)
  }

  onColorSelect(color) {
    return () => {
      this.props.onColorSelect(color)
    }
  }

  render() {
    const colorPaletteItems = this.paletteColors.map(paletteColor => {
      const cssClass =
        paletteColor.toLowerCase() === this.props.color.toLowerCase()
          ? 'fa-circle-o'
          : 'fa-circle'
      return (
        <i
          key={paletteColor}
          className={'pointer fa ' + cssClass}
          style={{ color: paletteColor }}
          onClick={this.onColorSelect(paletteColor)}
        >
          &nbsp;
        </i>
      )
    })
    return (
      <div className="graph-legend-popover">
        <p className="m-b-0">{colorPaletteItems}</p>
      </div>
    )
  }
}
