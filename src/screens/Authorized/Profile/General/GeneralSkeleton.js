import React, { Component } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;

  .circle {
    margin: auto;
    margin-top: 20px;
    width: 100px;
  }

  .text {
    width: 100%;
    margin-top: 20px;
  }
`

class JobSkeleton extends Component {
  render() {
    return (
      <Container>
        <div className="circle" >
          <Skeleton circle width={100} height={100} />
        </div>
        <div className="text" >
          <Skeleton />
          <Skeleton height={10} />
          <Skeleton width="50%" height={10} />
        </div>
      </Container>
    )
  }
}

export default JobSkeleton