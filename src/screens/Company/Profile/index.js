import React, { Component } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import SwipeableViews from 'react-swipeable-views'

import General from './General'
// import FloatingTabs from '../../../components/FloatingTabs'
import Skills from './Skills/index'
import BaseRoute from '../../../components/BaseRoute'
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
    max-width: 90%;
    margin: auto;
    height: 100vh;
    display: flex;
    justify-content: center;

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
        <Skills isActive={this.selectedTab === 2} {...this.props} />
      </SwipeableViews>
    )
  }
  
  render() {
    return (
      <BaseRoute 
        backPath="/customers/menu"
        title="Profile" 
        id={ID_PROFILE} backgroundColor="#fbfbfb" 
        noPadding
      >
        <Container>
          <div className="profile-base-wrapper" >
            <div className="profile-wrapper" >
              <General {...this.props} />
            </div>
          </div>
        </Container>
      </BaseRoute>
    )
  }
}


export default BasicProfile