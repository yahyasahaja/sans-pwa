import React, { Component } from 'react'
import { ParallaxBanner, Parallax } from "react-scroll-parallax"
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import Feature from './Feature'
import MDIcon from '../../components/MDIcon'
import Plx from 'react-plx'

const Container = styled.div`
  background: #ffffffe6;
  position: relative;
  overflow: hidden;
  height: 100%;

  .features {
    height: 700px;
    position: relative;
    align-items: center;

    .features-title {
      margin-top: 100px;
      font-size: 15pt;
      display: flex;
      justify-content: center;

      h2 {
        font-weight: 300;
        border: 2px dashed #5a5a5a;
        padding: 10px 30px;
        border-radius: 300px;
        display: flex;
        align-items: center;

        span.mdi {
          font-size: 25pt;
          margin-right: 10px;
        }
      }
    }

    .features-wrapper {
      margin-top: 50px;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 20px;
      align-items: center;
    }
  }
`

@observer
class FeaturesMobile extends Component {
  @observable isButtonsActive = false

  render() {
    let style = {}

    if (!this.isButtonsActive) {
      style.display = 'none'
    }

    return (
      <ParallaxBanner 
        layers={[
          {
            image: '/images/sol2.jpg',
            amount: .4,
          },
        ]}
        style={{
          height: '1500px',
        }}
      >
        <Container className="features-container" id="features" >
          <div className="features">
            <div className="features-title" >
              <h2><MDIcon icon="star-circle-outline" />Features</h2>
            </div>
            <div className="features-wrapper" >
              <Feature 
                style={{marginBottom: 60}}
                src="/images/blockchain2.png" 
                title="Blockchain"
                desc="Our Blockchain technology allows automate verification of candidates"
              />
              <Feature 
                style={{marginBottom: 60}}
                src="/images/proofskills.png" 
                title="Prove Skill"
                desc="Provide a structural platform for candidates to prove their skills,
                therefor fasten the hiring process for HR"
              />
              <Feature 
                style={{marginBottom: 50}}
                src="/images/feature3.png" 
                title="Trust"
                desc="Cultivate a trustful network of candidates to encourage companies 
                to hires foreigners"
              />
            </div>
          </div>
        </Container>
      </ParallaxBanner>
    )
  }
}

export default FeaturesMobile