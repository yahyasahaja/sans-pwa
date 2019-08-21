import React, { Component } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

const Container = styled.div`
  display: block;

  .middle {
    display: flex;
    padding: 20px 10px;
    width: 100%;

    .text {
      margin-left: 10px;
      width: 100%;
    }
  }
`

class JobDescriptionSkeleton extends Component {
  render() {
    return (
      <Container>
        <Skeleton height={200} />
        <div><Skeleton width="50%" height={10} /></div>
        <div><Skeleton width="200px" height={10} /></div>

        <div className="middle" > 
          <div  >
            <Skeleton circle width={100} height={100} />
          </div>
          <div className="text" >
            <Skeleton />
            <Skeleton height={10} />
            <Skeleton width="50%" height={10} />
          </div>
        </div>
      </Container>
    )
  }
}

export default JobDescriptionSkeleton