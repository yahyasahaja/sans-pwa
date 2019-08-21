import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { serviceWorker } from '../services/stores'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #3498db;
  color: white;
  position: fixed;
  align-items: center;
  width: 100%;
  z-index: 1300;
  
  .left {
    display: flex;
    align-items: center;

    .close {
      font-size: 37pt;
      line-height: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 35px;
      width: 35px;
      font-weight: 100;
      margin-top: -10px;
      transition: .3s;

      &:active {
        opacity: .3;
        transition: .1s;
      }
    }
    
    .title {
      font-size: 11pt;
      margin-left: 10px;
    }
  }

  .install-button {
    padding: 10px 20px;
    border-radius: 30px;
    border: 1px solid white;
    transition: .3s;

    &:active {
      opacity: .3;
      transition: .1s;
    }
  }
`

const BackContainer = styled.div`
  width: 100%;
  height: 60px;
  position: relative;
`

@observer
class AppInstall extends Component {
  render() {
    if (!serviceWorker.isInstallPromptUIShowed) return <div />

    return (
      <React.Fragment>
        <Container >
          <div className="left" >
            <div className="close" onClick={() => serviceWorker.rejectAppInstall()} >
              &times;
            </div>
            <div className="title" >
              Keep track of application process
            </div>
          </div>

          <div className="install-button"  onClick={() => serviceWorker.showAppInstallPrompt()} >
            Install
          </div>
        </Container>
        <BackContainer />
      </React.Fragment>
    )
  }
}

export default AppInstall