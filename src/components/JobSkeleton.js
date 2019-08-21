import React, { Component } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  padding: 20px 10px;
  width: 100%;

  .text {
    margin-left: 10px;
    width: 100%;
  }
`

class JobSkeleton extends Component {
  render() {
    return (
      <Container>
        <div  >
          <Skeleton circle width={50} height={50} />
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