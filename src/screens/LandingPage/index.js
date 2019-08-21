import React, { Component } from 'react'
import styled from 'styled-components'
import { withController } from "react-scroll-parallax"
import posed from 'react-pose'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import MediaQuery from 'react-responsive'

import TopBar from './TopBar'
import FrontPage from './FrontPage'
import Flow from './Flow'
import Features from './Features'
import About from './About'

import TopBarMobile from './TopBarMobile'
import FrontPageMobile from './FrontPageMobile'
import FeaturesMobile from './FeaturesMobile';
import FlowMobile from './FlowMobile';
import AboutMobile from './AboutMobile';

const Container = styled.div`
  position: relative;
  background: white;

  .front-page, .flow-container2, .about-container2 {
    position: relative;
  }
`

const PosedContainer = posed(Container)({
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 500 },
  },
  close: {
    opacity: 0,
    y: -20,
    transition: { duration: 500 },
  },
})

@observer
class LandingPage extends Component {
  @observable containerPose = 'open'

  componentDidMount() {
    window.scrollTo(0, 0)
    this.props.parallaxController.update()
    this.props.parallaxController.getElements().forEach(el => {
      this.props.parallaxController.resetElementStyles(el)
    })
  }
  
  render() {
    return (
      <PosedContainer
        pose={this.containerPose} 
        initialPose="close"
      >
        <MediaQuery minWidth={800} >
          <TopBar />
          <FrontPage />
          <Features />
          <Flow />
          <About />
        </MediaQuery>

        <MediaQuery maxWidth={800}>
          <TopBarMobile />
          <FrontPageMobile />
          <FeaturesMobile />
          <FlowMobile />
          <AboutMobile />
        </MediaQuery>
      </PosedContainer>
    )
  }
}

export default withController(LandingPage)