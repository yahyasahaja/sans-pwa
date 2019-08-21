import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import { observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'
import { observable } from 'mobx'
import posed from 'react-pose'
import MediaQuery from 'react-responsive'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { popupStack } from '../services/stores'
import MDIcon from './MDIcon'
import Loading from './Loading'

const StyledToolbar = styled(Toolbar)`
  && {
    min-height: 47px;
  }
`

const StyledAppBar = styled(AppBar)`
  && {
    color: inherit;
    background-color: white;
    box-shadow: 1px 1px 10px #0000002b;
  }
`

const Container = styled.form`
  overflow: hidden;
  position: relative;
  
  @media only screen and (max-width: 800px) {
    padding-top: 37px;
    height: 100vh;

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
        overflow-y: ${({rebaseDialog}) => rebaseDialog ? 'auto' : 'unset'};
        height: ${({rebaseDialog}) => rebaseDialog ? 'auto' : 'calc(100vh - 150px)'};
      }
    }
  }
`

const PosedContainer = posed(Container)({
  active: { x: 0, transition: { duration: 300 } },
  inactive: { x: -150, transition: { duration: 700 } }
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.direction} ref={ref} {...props} />;
})

@observer
class DialogRoute extends Component {
  @observable stackId = -1
  @observable isOpened = true
  @observable isCancelDialogOpened = false
  
  isClosed = false

  componentDidMount() {
    if (this.props.isMobile) popupStack.push(stackId => this.stackId = stackId)
    this.props.close(this.close)
  }

  componentWillUnmount() {
    if (!this.isClosed && this.props.isMobile) popupStack.popStackId(this.stackId)
  }

  close = () => {
    this.isOpened = false
    let { history, backPath, includeQueryString } = this.props

    this.isClosed = true
    if (this.props.isMobile) popupStack.pop()
    setTimeout(() => {
      let querystring = includeQueryString ? window.location.search : ''
      if (backPath) return history.replace(`${backPath}${querystring}`)
      else history.goBack()
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

  cancel = () => {
    this.isCancelDialogOpened = true
  }

  renderContent() {
    let { title, isMobile, rebaseDialog, formProps, wrapperProps } = this.props
    let isAtTop = popupStack.popups.length > 0 
      && popupStack.popups[popupStack.popups.length - 1] === this.stackId
    let pose = isAtTop || !isMobile ? 'active' : 'inactive'

    return (
      <PosedContainer 
        pose={pose} initialPose="active" withParent={false}  
        onSubmit={this.onSubmit}
        rebaseDialog={rebaseDialog}
        {...formProps}
      >
        {
          isMobile && (
            <StyledAppBar >
              <StyledToolbar>
                <IconButton edge="start" color="inherit" onClick={this.cancel}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography style={{flex: 1}} variant="h6">
                  {title || 'Edit'}
                </Typography>
                <Button disabled={this.props.isLoading} type="submit" color="inherit" >
                  <MDIcon margin icon="content-save" />
                  Save
                </Button>
              </StyledToolbar>
            </StyledAppBar>
          )
        }
        {isMobile && this.renderChildren()}
        {
          !isMobile && (
            <div className="wrapper" {...wrapperProps} >
              {this.renderChildren()}
              <DialogActions>
                <Button onClick={this.cancel} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </div>
          )
        }
        {this.props.isLoading && <Loading />}
      </PosedContainer>
    )
  }

  renderDialogs() {
    return (
      <Dialog 
        open={this.isCancelDialogOpened}
        onClose={() => this.isCancelDialogOpened = false} 
      >
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to discard this changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            this.isCancelDialogOpened = false
            this.close()
          }} color="secondary">
            Discard
          </Button>
          <Button onClick={() => this.isCancelDialogOpened = false} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    let { direction, isMobile, scroll, rebaseDialog } = this.props

    let finalDirection = direction

    if (!direction) {
      finalDirection = isMobile ? 'left' : 'up'
    }

    if (!isMobile && rebaseDialog) return (
      <React.Fragment>
        {this.renderContent()}
        {this.renderDialogs()}
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <Dialog 
          fullScreen={isMobile}
          open={this.isOpened} 
          onClose={this.cancel} 
          TransitionComponent={Transition}
          TransitionProps={{direction: finalDirection}}
          maxWidth="md"
          fullWidth
          scroll={isMobile ? 'paper' : scroll || 'paper'}
        >
          {this.renderContent()}
        </Dialog>
        {this.renderDialogs()}
      </React.Fragment>
    )
  }
}

class FormRoute extends Component {
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

export default withRouter(FormRoute)