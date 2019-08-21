import React, { Component } from 'react'
import Plx from 'react-plx'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

const Container = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  position: relative;
`
let LINE_LENGTH = 20

const Line = styled(Plx)`
  height: 50%;
  width: 5px;
  background: #60ab8b;
  position: absolute;
  transform-origin: 50% 100%;
  transform: rotate(${({rotation}) => rotation}deg);
`



@observer
class Fireworks extends Component {
  @observable lines = []

  rotate(cx, cy, x, y, angle,anticlock_wise = false) {
    if(angle === 0){
        return {x:parseInt(x), y:parseInt(y)};
    }
    let radians = Math.PI / 180 * angle
    
    if (!anticlock_wise) radians *= -1
    let cos = Math.cos(radians)
    let sin = Math.sin(radians)
    let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
    let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
    return { x: nx, y: ny }
 }

  componentDidMount() {
    for (let i = 0; i < LINE_LENGTH; i++) {
      let diff = 360 / LINE_LENGTH
      let rotation = diff * i

      let point1 = this.rotate(0, 0, 0, -50, rotation)
      let point2 = this.rotate(0, 0, 0, -300, rotation)

      this.lines.push([
        {
          start: '.bottom-line-wrapper',
          duration: '200vh',
          properties: [
            {
              startValue: rotation,
              endValue: rotation,
              property: 'rotate',
            },
          ],
        },
        {
          start: '.bottom-line-wrapper',
          duration: '50vh',
          properties: [
            {
              startValue: 0,
              endValue: .5,
              property: 'scaleY',
            },
            {
              startValue: 0,
              endValue: point1.x,
              property: 'translateX',
            },
            {
              startValue: 0,
              endValue: point1.y,
              property: 'translateY',
            },
          ],
        },
        {
          start: '.bottom-line-wrapper',
          startOffset: '80vh',
          duration: '20vh',
          properties: [
            {
              startValue: .5,
              endValue: 0,
              property: 'scaleY',
            },
            {
              startValue: point1.x,
              endValue: point2.x,
              property: 'translateX',
            },
            {
              startValue: point1.y,
              endValue: point2.y,
              property: 'translateY',
            },
          ],
        },
      ])
    }
  }

  render() {
    let diff = 360 / LINE_LENGTH

    return (
      <Container className={this.props.className} >
        {this.lines.map((d, i) => {
          return (
            <Line 
              key={i}
              rotation={i * diff}
              className="plx-line" 
              parallaxData={d}
            />
          )
        })}
      </Container>
    )
  }
}

export default Fireworks