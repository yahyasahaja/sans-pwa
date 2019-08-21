import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Drawer from '@material-ui/core/SwipeableDrawer'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import { observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'
import { observable } from 'mobx'
import posed from 'react-pose'
import MediaQuery from 'react-responsive'

// import { popupStack } from '../services/stores'
import MDIcon from './MDIcon'
import Loading from './Loading'

const Container = styled.div`
  overflow: hidden;
  position: relative;

  .close {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 35pt;
    font-weight: 200;
    line-height: 1;
    padding-right: 11px;
    cursor: pointer;

    &:active {
      opacity: .3;
    }
  }
  
  @media only screen and (max-width: 800px) {
    padding-top: 37px;
    height: ${({height}) => height || '90vh'};

    .screen-container {
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
    }
  }

  @media only screen and (min-width: 800px) {
    height: calc(100% - 96px);

    .wrapper {
      display: block;
      height: 100%;

      .screen-container {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100vh - 150px);
      }
    }
  }
`

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.direction} ref={ref} {...props} />;
})

@observer
class DialogRoute extends Component {
  @observable isOpened = false
  
  isClosed = false

  componentDidMount() {
    // if (this.props.isMobile) popupStack.push(stackId => this.stackId = stackId)
    if (this.props.close) this.props.close(this.close)
    this.isOpened = true
    window.something = this
  }

  close = () => {
    this.isOpened = false
    let { history, backPath, includeQueryString, withoutBack } = this.props

    this.isClosed = true
    setTimeout(() => {
      if (!withoutBack) {
        let querystring = includeQueryString ? window.location.search : ''
        if (backPath) return history.replace(`${backPath}${querystring}`)
        else history.goBack()
      }

      if (this.props.onClose) this.props.onClose()
    }, 300)
  }

  onSubmit = e => {
    e.preventDefault()

    if (this.props.onSubmit) this.props.onSubmit()
  }

  renderChildren = () => {
    return (
      <div className="screen-container" onScroll={this.props.onScroll}>
        {this.props.children}
      </div>
    )
  }

  renderDialog() {
    let { direction = 'up' } = this.props

    return (
      <Dialog 
        open={this.isOpened} 
        onClose={this.close} 
        TransitionComponent={Transition}
        TransitionProps={{direction}}
        maxWidth="md"
        fullWidth
        scroll="body"
      >
        <Container 
          initialPose="active" withParent={false}  
          onSubmit={this.onSubmit}
          height={this.props.height}
        >
          <div className="close" onClick={this.close} >
            <div>&times;</div>
          </div>
          {this.renderChildren()}
          {this.props.isLoading && <Loading />}
        </Container>
      </Dialog>
    )
  }

  renderDrawer() {
    let { direction = 'bottom' } = this.props

    return ( 
      <Drawer
        anchor={direction}
        open={this.isOpened}
        onClose={this.close}
        onOpen={() => this.isOpened = true}
        PaperProps={{style:{ borderRadius: '20px 20px 0 0' }}}
      >
        <Container 
          initialPose="active" withParent={false}  
          onSubmit={this.onSubmit}
          height={this.props.height}
        >
          {this.renderChildren()}
          {this.props.isLoading && <Loading />}
        </Container>
      </Drawer>
    )
  }

  render() {
    if (this.props.isMobile) return this.renderDrawer()
    return this.renderDialog()
  }
}

class ViewRoute extends Component {
  render() {
    return (
      <React.Fragment>
        <MediaQuery minWidth={800}>
          <DialogRoute {...this.props} isMobile={false} />
        </MediaQuery>
        <MediaQuery maxWidth={800}>
          <DialogRoute {...this.props} isMobile={true} />
        </MediaQuery>
      </React.Fragment>
    )
  }
}

export default withRouter(ViewRoute)