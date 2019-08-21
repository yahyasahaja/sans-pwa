import React, { Component } from 'react'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background: #ecf0f1;
  justify-content: center;
  align-items: center;
  position: relative;
`

export default class index extends Component {
  render() {
    return (
      <Container >
        <div>
          <CircularProgress />
        </div>
      </Container>
    )
  }
}