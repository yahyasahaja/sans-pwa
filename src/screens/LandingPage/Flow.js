import React, { Component } from 'react'
import { ParallaxBanner, Parallax } from "react-scroll-parallax"
import styled from 'styled-components'
import Plx from 'react-plx'

import Feature from './Feature'
import MDIcon from '../../components/MDIcon'

const parallaxData = [
  {
    start: '.flow-container',
    duration: '80vh',
    properties: [
      {
        startValue: .5,
        endValue: 1,
        property: 'scale',
      },
      {
        startValue: 50,
        endValue: 0,
        unit: 'vh',
        property: 'translateX',
      },
      {
        startValue: 0,
        endValue: 1,
        property: 'opacity',
      },
    ],
  },
  {
    start: '.flow-container',
    startOffset: '80vh',
    duration: '20vh',
    properties: [
      {
        startValue: 1,
        endValue: 1.1,
        property: 'scale',
      },
    ],
  },
  {
    start: '.flow-container',
    startOffset: '100vh',
    duration: '20vh',
    properties: [
      {
        startValue: 1.1,
        endValue: 1,
        property: 'scale',
      },
    ],
  },
  {
    start: '.flow-container',
    startOffset: '120vh',
    duration: '100vh',
    properties: [
      {
        startValue: 1,
        endValue: .5,
        property: 'scale',
      },
      {
        startValue: 0,
        endValue: -50,
        unit: 'vh',
        property: 'translateX',
      },
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
]

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  z-index: 3;

  .flow-container2 {
    background: #1abc9cc3;
    overflow: hidden;
    height: 100%;

    .flow {
      height: 700px;

      .flow-title {
        margin-top: 50px;
        font-size: 15pt;
        display: flex;
        justify-content: center;
        color: white;

        h2 {
          font-weight: 300;
          border: 2px dashed white;
          padding: 10px 30px;
          border-radius: 300px;
          display: flex;
          align-items: center;

          span.mdi {
            font-size: 25pt;
            margin-right: 10px;
          }
        }

        .title-line-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 100px;

          .line-parallax {
            width: 80%;
            height: 5px;
            background-color: white;
          }
        }
      }

      .flow-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        padding: 0 20px;
        margin-top: 150px;
      }

      .line-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 130px;

        .line-parallax {
          width: 80%;
          height: 5px;
          background-color: white;
          transform: scaleX(0);
        }
      }
    }
  }
`

const lineParallax = [
  {
    start: 'self',
    duration: '80vh',
    properties: [
      {
        startValue: 0,
        endValue: 1,
        property: 'scaleX',
      },
    ],
  },
  {
    start: 'self',
    startOffset: '60vh',
    duration: '20vh',
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'scaleY',
      },
    ],
  },
]

export default class Flow extends Component {
  render() {
    return (
      <Container className="flow-container">
        <ParallaxBanner 
          layers={[
            {
              image: '/images/sol3.jpg',
              amount: .4,
            },
          ]}
          style={{
            height: '800px',
          }}
        >
          <div className="flow-container2" >
            <div className="flow">
              <div className="flow-title" >
                <Parallax y={['-100%', '100%']} >
                  <h2><MDIcon icon="chart-timeline-variant" />How it works</h2>
                </Parallax>
              </div>
              <div className="flow-wrapper" >
                <Plx parallaxData={ parallaxData }>
                  <Feature 
                    white 
                    src="/images/complete.svg"
                    title="Complete Profile"
                    desc="Complete profile with an experiences and skills"
                  />
                </Plx>
                <Plx parallaxData={ parallaxData }>
                  <Feature 
                    white 
                    src="/images/proof.png"
                    title="Data Proofing"
                    desc="We will take care to proof your data into our Blockchain"
                  />
                </Plx>
                <Plx parallaxData={ parallaxData }>
                  <Feature 
                    white 
                    src="/images/proofskills.png"
                    title="Prove Skills"
                    desc="Take part in well design journey to learn and prove your skills to
                    possible recruiter"
                  />
                </Plx>
                <Plx parallaxData={ parallaxData }>
                  <Feature 
                    white 
                    src="/images/send.svg"
                    title="Apply Job"
                    desc="Apply to global jobs, so companies can review your profile with no
                    worries about your abilities"
                  />
                </Plx>
              </div>
              <div className="line-wrapper" >
                <Plx className="line-parallax" parallaxData={ lineParallax } />
              </div>
            </div>
          </div>
        </ParallaxBanner>
      </Container>
    )
  }
}
