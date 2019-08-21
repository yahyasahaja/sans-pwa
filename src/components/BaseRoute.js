import React, { Component } from 'react'
import styled from 'styled-components'
import { popupStack, serviceWorker } from '../services/stores'
import { observer } from 'mobx-react'
import posed from 'react-pose'
import MediaQuery from 'react-responsive'
import AppInstall from './AppInstall'

const Container = styled.div`
  display: block;
  padding-top: ${({appinstall}) => appinstall ? '45px' : '70px'};
  height: 100vh;
  min-height: 100vh;
`

const WebContainer = styled.div`
  display: block;
  padding-top: ${({noPadding}) => noPadding ? 'none' : '15px'};
`

const PosedContainer = posed(Container)({
  active: { x: 0, transition: { duration: 300 } },
  inactive: { x: -150, transition: { duration: 700 } }
})

@observer
class BaseRoute extends Component {
  renderMobileView() {
    return (
      <MediaQuery maxWidth={800} >
        <PosedContainer 
          style={this.props.mobileStyle}
          appinstall={serviceWorker.isInstallPromptUIShowed}
          pose={popupStack.isPopupActive ? 'inactive' : 'active'} initialPose="active">
          <AppInstall />
          {this.props.children}
        </PosedContainer>
      </MediaQuery>
    )
  }
  renderWebView() {
    return (
      <MediaQuery minWidth={800} >
        <WebContainer style={this.props.webStyle} noPadding={this.props.noPadding} >
        {this.props.children}
        </WebContainer>
      </MediaQuery>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderMobileView()}
        {this.renderWebView()}
      </React.Fragment>
    )
  }
}

export default BaseRoute