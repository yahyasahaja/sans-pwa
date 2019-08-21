import React, { Component } from 'react'
import styled from 'styled-components'

const Icon = styled.span`
  width: 1em;
  height: 1em;
  font-size: 1.5rem;
  line-height: 1;
`

export default class MDIcon extends Component {
  render() {
    let { color, margin, className = '', style = {}, onClick } = this.props

    if (color) style.color = color
    if (margin) style.margin = '0 5px'

    return (
      <Icon 
        onClick={onClick} 
        style={style} 
        className={`${className} mdi mdi-${this.props.icon}`} 
      />
    )
  }
}
