import React, { Component } from 'react'
import PopupRoute from '../../../components/PopupRoute'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import SwipeableViews from 'react-swipeable-views'

import General from './General'
import FloatingTabs from '../../../components/FloatingTabs'
import Experiences from './Experiences'
import Educations from './Educations'
import Skills from './Skills/index'
// import CompleteProfile from './CompleteProfile'

const ID_PROFILE = 'profile_id'

const Container = styled.div`
  display: block;
  min-height: 100vh;
  background: white;

  @media only screen and (min-width: 800px) {
    width: 100%;
    margin: auto;
    background: #fbfbfb;
  }

  .profile-base-wrapper {
    width: 100%;

    @media only screen and (min-width: 800px) {
      max-width: 90%;
      margin: auto;
    }
  }

  .profile-wrapper {
    width: 100%;

    @media only screen and (min-width: 800px) {
      width: 40%;
      max-width: 460px;
      min-width: 400px;
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .profile-web {
    width: 100%;
    display: flex;

    .profile-gap-web {
      width: 92%;
      min-width: 430px;
      max-width: 500px;
      top: 51px;
      height: 200px;
    }

    .profile-sidebar-web {
      width: 100%;
    }
  }
`

@observer
class BasicProfile extends Component {
  @observable selectedTab = 0

  renderContent() {
    return (
      <SwipeableViews
        animateHeight
        enableMouseEvents
        className="content"
        axis="x"
        index={this.selectedTab}
        onChangeIndex={v => this.selectedTab = v}
      >
        <Experiences isActive={this.selectedTab === 0} {...this.props} />
        <Educations isActive={this.selectedTab === 1} {...this.props} />
        <Skills isActive={this.selectedTab === 2} {...this.props} />
      </SwipeableViews>
    )
  }
  
  render() {
    return (
      <PopupRoute 
        backPath="/customers/menu"
        title="Profile" 
        id={ID_PROFILE} backgroundColor="#fbfbfb" 
      >
        <Container>
          <div className="profile-base-wrapper" >
            <div className="profile-wrapper" >
              <General {...this.props} />
              <MediaQuery maxWidth={800} >
                <FloatingTabs id={ID_PROFILE} >
                  <Tabs 
                    value={this.selectedTab} 
                    indicatorColor="primary" 
                    textColor="primary" 
                    variant="fullWidth"
                    onChange={(e, v) => this.selectedTab = v}>
                    <Tab label="Experiences" />
                    <Tab label="Educations" />
                    <Tab label="Skills" />
                  </Tabs>
                </FloatingTabs>
                {this.renderContent()}
              </MediaQuery>
            </div>
            
            <MediaQuery minWidth={800} >
              <div className="profile-web" >
                <div className="profile-gap-web" />
                <div className="profile-sidebar-web">
                  <Experiences {...this.props} />
                  <Educations {...this.props} />
                  <Skills {...this.props} />
                </div>
              </div>
            </MediaQuery>
          </div>
        </Container>
      </PopupRoute>
    )
  }
}


export default BasicProfile