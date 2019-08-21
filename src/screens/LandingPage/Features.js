import React, { Component } from 'react'
import { ParallaxBanner, Parallax } from "react-scroll-parallax"
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import Feature from './Feature'
import MDIcon from '../../components/MDIcon'
import Plx from 'react-plx'
import { responsive } from '../../services/stores';

const Container = styled.div`
  background: #ffffffe6;
  height: 100%;
  position: relative;
  overflow: hidden;

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
      margin-top: 150px;
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      padding: 0 20px;
    }
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    
    .button {
      padding: 10px 30px;
      margin: 0 4px;
      font-size: 12pt;
      border-radius: 30px;
      transition: .3s;
      cursor: pointer;
      display: flex;
      align-items: center;
      border: 1px solid #5a5a5a;
      font-weight: 300px;
      font-size: 20pt;
      color: inherit;

      &.filled {
        background: #3498db;
        color: white;
        font-weight: 400;
        border: none;

        &:visited {
          color: white;
        }
      }

      &:hover {
        transform: scale(1.05);
      }
      
      &:visited {
        color: inherit;
      }

      &:active {
        opacity: .3;
        transition: .01s;
      }
    }
  }

  .white-parallax {
    background: white;
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .laptop-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    position: fixed;

    .laptop-parallax {
      height: 500px;
      opacity: 0;

      img {
        height: 100%;
      }
    }
  }

  .smartphone-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    position: fixed;

    .smartphone-parallax {
      height: 500px;
      opacity: 0;
      margin-right: 600px;

      img {
        height: 100%;
      }
    }
  }

  .parallax-buttons {
    position: fixed;
    z-index: 5;
    top: 300px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding-left: 50px;
    
    .buttons-wrapper {
      width: 400px;

      .title {
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
          font-size: 16pt;

          span.mdi {
            font-size: 25pt;
            margin-right: 10px;
          }
        }
      }

      .desc {
        font-size: 12pt;
        text-align: center;
      }
      
      .parallax-button {
        opacity: 0;
      }

      .middle-button {
        margin: 30px 0;
      }

      .line-wrapper {
        display: flex;
        justify-content: center;
        margin: 50px 0;

        .line-parallax {
          width: 100%;
          height: 2px;
          background-color: #5a5a5a57;
          transform: scaleX(0);
        }
      }
    }
  }

  .bottom-line-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 3650px;

    .line-parallax {
      width: 80%;
      height: 5px;
      background-color: #5a5a5a;
      transform: scaleX(0);
    }
  }
`

const buttonLeftParallax = [
  {
    start: 1500,
    duration: '50vh',
    properties: [
      {
        startValue: -350,
        endValue: 0,
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
    start: 3000,
    startOffset: '120vh',
    duration: '50vh',
    properties: [
      {
        startValue: 0,
        endValue: -350,
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

const buttonRightParallax = [
  {
    start: 1500,
    duration: '50vh',
    properties: [
      {
        startValue: 350,
        endValue: 0,
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
    start: 3000,
    startOffset: '120vh',
    duration: '50vh',
    properties: [
      {
        startValue: 0,
        endValue: -350,
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

const lineRightParallax = [
  {
    start: 1300,
    duration: '120vh',
    properties: [
      {
        startValue: -50,
        endValue: 0,
        unit: '%',
        property: 'translateX',
      },
      {
        startValue: 0,
        endValue: 1,
        property: 'scaleX',
      },
      {
        startValue: 0,
        endValue: 1,
        property: 'opactiy',
      },
    ],
  },
  {
    start: 1300,
    startOffset: '120vh',
    duration: '120vh',
    properties: [
      {
        startValue: 0,
        endValue: 50,
        unit: '%',
        property: 'translateX',
      },
      {
        startValue: 1,
        endValue: 0,
        property: 'scaleX',
      },
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
]

const lineLeftParallax = [
  {
    start: 1300,
    duration: '120vh',
    properties: [
      {
        startValue: 50,
        endValue: 0,
        unit: '%',
        property: 'translateX',
      },
      {
        startValue: 0,
        endValue: 1,
        property: 'scaleX',
      },
      {
        startValue: 0,
        endValue: 1,
        property: 'opacity',
      },
    ],
  },
  {
    start: 1300,
    startOffset: '120vh',
    duration: '120vh',
    properties: [
      {
        startValue: 0,
        endValue: -50,
        unit: '%',
        property: 'translateX',
      },
      {
        startValue: 1,
        endValue: 0,
        property: 'scaleX',
      },
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
]

const laptopParallax = [
  {
    start: 1000,
    duration: '100vh',
    properties: [
      {
        startValue: 0,
        endValue: 1,
        property: 'opacity',
      },
      {
        startValue: 100,
        endValue: 0,
        unit: '%',
        property: 'translateY',
      },
    ],
  },
  {
    start: 1300,
    startOffset: '150vh',
    duration: '100vh',
    properties: [
      {
        startValue: 0,
        endValue: 30,
        unit: '%',
        property: 'translateX',
      },
    ],
  },
  {
    start: 2600,
    startOffset: '150vh',
    duration: '100vh',
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
      {
        startValue: 30,
        endValue: 100,
        unit: '%',
        property: 'translateX',
      },
    ],
  },
]

const smartphoneParallax = [
  {
    start: 2600,
    duration: '80vh',
    properties: [
      {
        startValue: 0,
        endValue: 1,
        property: 'opacity',
      },
      {
        startValue: -50,
        endValue: 0,
        unit: '%',
        property: 'translateX',
      },
    ],
  },
  {
    start: 2600,
    startOffset: '150vh',
    duration: '100vh',
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
      {
        startValue: 0,
        endValue: -100,
        unit: '%',
        property: 'translateY',
      },
    ],
  },
]

const whiteParallax = [
  {
    start: 1600,
    duration: '50vh',
    properties: [
      {
        startValue: 0,
        endValue: 1,
        property: 'opacity',
      },
    ],
  },
  {
    start: 3000,
    startOffset: '160vh',
    duration: '50vh',
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
]

const bottomLineParallax = [
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

class Button extends Component {
  render() {
    let { filled } = this.props
    return (
      <div className="button-container" >
        <Link to={this.props.to} className={`button ${filled ? 'filled' : ''}`}>
          {this.props.children}
        </Link>
      </div>
    )
  }
}

@observer
class FrontPage extends Component {
  @observable isButtonsActive = false

  render() {
    let style = {}

    if (!this.isButtonsActive) {
      style.display = 'none'
    }

    console.log(responsive.showWideParallax)

    return (
      <ParallaxBanner 
        layers={[
          {
            image: '/images/sol2.jpg',
            amount: 0,
          },
        ]}
        style={{
          height: !responsive.showWideParallax ? '800px' : '4500px',
        }}
      >
        <Container className="features-container" id="features" >
          <div className="features">
            <div className="features-title" >
              <Parallax y={['-100%', '100%']} >
                <h2><MDIcon icon="star-circle-outline" />Features</h2>
              </Parallax>
            </div>
            <div className="features-wrapper" >
              <Parallax y={['20%', '-60%']} >
                <Feature 
                  blue
                  src="/images/blockchain2.png" 
                  title="Blockchain"
                  desc="Our Blockchain technology allows automate verification of candidates"
                />
              </Parallax>
              <Parallax y={['-50%', '50%']} >
                <Feature 
                  blue
                  src="/images/proofskills.png" 
                  title="Prove Skill"
                  desc="Provide a structural platform for candidates to prove their skills,
                  therefor fasten the hiring process for HR"
                />
              </Parallax>
              <Parallax y={['20%', '-60%']} >
                <Feature 
                  blue
                  src="/images/feature3.png" 
                  title="Trust"
                  desc="Cultivate a trustful network of candidates to encourage companies 
                  to hires foreigners"
                />  
              </Parallax>
            </div>
          </div>
          {
            responsive.showWideParallax && (
              <React.Fragment>
                <div className="start-parallax-buttons" />
                  <Plx style={style} className="white-parallax" parallaxData={ whiteParallax } />
                  <div style={style} className="laptop-container" >
                    <Plx 
                      onPlxStart={() => this.isButtonsActive = true}
                      onPlxEnd={() => this.isButtonsActive = false}
                      className="laptop-parallax" 
                      parallaxData={ laptopParallax }>
                      <img src="images/laptop.png" alt="" />
                    </Plx>
                  </div>
                  <div style={style} className="smartphone-container" >
                    <Plx className="smartphone-parallax" parallaxData={ smartphoneParallax }>
                      <img src="images/smartphone.png" alt="" />
                    </Plx>
                  </div>
                  <div style={style} className="parallax-buttons">
                    <div className="buttons-wrapper" >
                      <div className="line-wrapper" >
                        <Plx 
                          className="line-parallax" 
                          parallaxData={ lineRightParallax } 
                        />
                      </div>
                      <Plx className="parallax-button" parallaxData={ buttonLeftParallax }>
                        <div className="title" >
                          <h2>
                            <MDIcon icon="star-circle-outline" />Be trusted by global companies
                          </h2>
                        </div>
                      </Plx>
                      <Plx className="parallax-button middle-button" 
                        parallaxData={ buttonRightParallax }>
                        <div className="desc" >
                          With our blockchain, companies can be matched with your skills based on 
                          their necessities, and your chances to be hired in a foreign company can 
                          grow exponentially
                        </div>
                      </Plx>
                      <Plx className="parallax-button" parallaxData={ buttonLeftParallax }>
                        <Button filled to="/customers/jobs/home" >Join Our Network</Button>
                      </Plx>
                      <div className="line-wrapper" >
                        <Plx className="line-parallax" parallaxData={ lineLeftParallax } />
                      </div>
                    </div>
                  </div>
              </React.Fragment>
            )
          }
          <div className="bottom-line-wrapper" >
            <Plx className="line-parallax" parallaxData={ bottomLineParallax } />
          </div>
        </Container>
      </ParallaxBanner>
    )
  }
}

export default FrontPage