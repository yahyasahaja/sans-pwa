import React, { Component } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  border: 1px solid #e6e6e6;
  padding: 10px;
  background: white;
  margin: 10px 0;
  position: relative;

  @media only screen and (min-width: 800px) {
    border-radius: 10px;
    box-shadow: 1px 1px 10px #0000002b;
    border: 1px solid #e6e6e6;
  }

  .up {
    display: flex;

    .text {
      margin-left: 10px;
      width: 100%;
    }
  }

  .bottom {
    margin: 50px 0;
  }
`

class AppSkeleton extends Component {
  render() {
    return (
      <Container>
        <div className="up" >
          <div  >
            <Skeleton circle width={120} height={120} />
          </div>
          <div className="text" >
            <Skeleton />
            <Skeleton height={10} />
            <Skeleton width="50%" height={10} />
          </div>
        </div>
        
        <div className="bottom" >
          <Skeleton width="50%" height={10} />
          <Skeleton />
        </div>
      </Container>
    )
  }
}

export default AppSkeleton