import React, { Component } from 'react'
import { ParallaxBanner, Parallax } from "react-scroll-parallax"
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  background: #0494efc7;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;

  .text-container {
    color: white;
    text-align: center;
    padding: 20px;

    .title {
      height: 50px;
      margin-bottom: 30px;

      img {
        height: 100%;
      }
    }

    .desc {
      font-size: 15pt;
      font-weight: 400;
      margin-top: 20px;
    }

    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      
      a.button {
        padding: 10px 30px;
        margin: 0 4px;
        font-size: 12pt;
        border-radius: 30px;
        transition: .3s;
        cursor: pointer;
        display: flex;
        align-items: center;
        border: 1px solid #ffffff;
        font-weight: 300px;
        font-size: 20pt;
        color: white;

        &:hover {
          transform: scale(1.05);
        }
        
        &:visited {
          color: white;
        }

        &:active {
          opacity: .3;
          transition: .01s;
        }
      }
    }
  }
`

export default class FrontPageMobile extends Component {
  render() {
    return (
      <ParallaxBanner 
        layers={[
          {
            image: '/images/sol.jpg',
            amount: .5,
          },
        ]}
        style={{
          height: '100vh',
        }}
      >
        <Container className="front-page" id="home" >
          <div className="text-container" >
              <div className="title" ><img src="/images/jw_logo_w.svg" alt="" /></div>

              <div className="desc">A decentralized global network for job seekers</div>
              <div className="button-container" >
                <Link to="/customers/jobs/home" className="button">
                  Find Jobs
                </Link>
              </div>
          </div>
        </Container>
      </ParallaxBanner>
    )
  }
}
