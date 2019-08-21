import React, { Component } from 'react'
import { ParallaxBanner, Parallax } from "react-scroll-parallax"
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Feature from './Feature'
import MDIcon from '../../components/MDIcon'

const Container = styled.div`
  overflow: hidden;

  .about-container2 {
    background: #000000c3;
    overflow: hidden;
    height: 100%;

    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .about {
      height: 700px;

      .about-title {
        margin-top: 100px;
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
      }

      .about-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        padding: 0 100px;
        margin-top: 150px;

        .logo {
          width: 280px;
          height: 250px;
          display: flex;

          img {
            width: 100%;
          }
        }

        .right {
          width: 100%;
          display: flex;
          margin-left: 100px;

          .section {
            display: block;
            color: white;
            font-size: 12pt;
            margin: 10px;

            a {
              color: white;
            }

            .title {
              display: block;
              font-weight: bold;
              font-size: 14pt;
            }

            .list-container {
              display: block;

              .list-item {
                display: block;
                padding: 10px 12px;
                border-radius: 30px;
                border: 1px solid #ffffff00;
                margin: 5px;
                transition: .3s;
                cursor: pointer;

                &:hover {
                  border: 1px solid #ffffff;
                }

                &:active {
                  opacity: .3;
                  transition: .01s;
                }
              }
            }
          }
        }
      }
    }

    .copyright {
      color: white;
      position: absolute;
      bottom: 0;
      padding: 15px;
      width: 100%;
      text-align: center;
      font-size: 13pt;
      border-top: 1px dashed #ffffff4a;
    }
  }
`

export default class About extends Component {
  render() {
    return (
      <Container className="about-container">
        <ParallaxBanner 
          layers={[
            {
              image: '/images/sol.jpg',
              amount: .4,
            },
          ]}
          style={{
            height: '800px',
          }}
        >
          <div className="about-container2" >
            <div className="about" id="about">
              <div className="about-title" >
                <Parallax y={['-100%', '100%']} >
                  <h2><MDIcon icon="information" />About</h2>
                </Parallax>
              </div>
              <div className="about-wrapper" >
                <Parallax x={['-100%', '250%']} >
                  <div className="logo" >
                    <img src="/images/jw_logo_w.svg" alt="" />
                  </div>
                </Parallax>
                <Parallax x={['100%', '-180%']} >
                  <div className="right" >
                    <div className="section">
                      <div className="title" >Community</div>
                      <div className="list-container" >
                        <div className="list-item" ><Link to="/contact" >{'Q&a'}</Link></div>
                        <div className="list-item"><Link to="/contact" >Contact Us</Link></div>
                        <div className="list-item"><Link to="/terms" >Terms and Use</Link></div>
                        <div className="list-item">
                          <Link to="/privacy" >Privacy and Conditions</Link>
                        </div>
                      </div>
                    </div>

                    <div className="section">
                      <div className="title" >Work with us</div>
                      <div className="list-container">
                        <div className="list-item"><Link to="/careers" >Careers</Link></div>
                        <div className="list-item"><Link to="/jobaboards" >Job Aboards</Link></div>
                      </div>
                    </div>
                  </div>
                </Parallax>
              </div>
            </div>
            <div className="copyright" >
              Copyright &copy; 2019. Made with <span className="mdi mdi-heart" /> by Team
            </div>
          </div>
        </ParallaxBanner>
      </Container>
    )
  }
}
