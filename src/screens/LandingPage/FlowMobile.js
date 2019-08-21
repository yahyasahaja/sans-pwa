import React, { Component } from 'react'
import { ParallaxBanner, Parallax } from "react-scroll-parallax"
import styled from 'styled-components'
import Plx from 'react-plx'

import Feature from './Feature'
import MDIcon from '../../components/MDIcon'

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
        justify-content: center;
        flex-direction: column;
        padding: 0 20px;
        margin-top: 50px;
        align-items: center;
      }

      .line-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 55px;

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

export default class FlowMobile extends Component {
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
            height: '1600px',
          }}
        >
          <div className="flow-container2" >
            <div className="flow">
              <div className="flow-title" >
                <h2><MDIcon icon="chart-timeline-variant" />How it works</h2>
              </div>
              <div className="flow-wrapper" >
                <Feature 
                  white 
                  style={{marginBottom: 60}}
                  src="/images/complete.svg"
                  title="Complete Profile"
                  desc="Complete profile with an experiences and skills"
                />
                <Feature 
                  white 
                  style={{marginBottom: 60}}
                  src="/images/proof.png"
                  title="Data Proofing"
                  desc="We will take care to proof your data into our Blockchain"
                />
                <Feature 
                  white 
                  style={{marginBottom: 60}}
                  src="/images/proofskills.png"
                  title="Prove Skills"
                  desc="Take part in well design journey to learn and prove your skills to
                  possible recruiter"
                />
                <Feature 
                  white 
                  style={{marginBottom: 60}}
                  src="/images/send.svg"
                  title="Apply Job"
                  desc="Apply to global jobs, so companies can review your profile with no
                  worries about your abilities"
                />
              </div>
            </div>
          </div>
        </ParallaxBanner>
      </Container>
    )
  }
}
