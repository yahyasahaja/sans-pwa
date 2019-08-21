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
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import { popupStack, responsive } from '../services/stores'
import MDIcon from './MDIcon';

const StyledToolbar = styled(Toolbar)`
  && {
    min-height: 47px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
    }

    .logo {
      height: 33px;
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: center;
      left: 0;

      @media only screen and (max-width: 800px) {
        display: none;
      }

      img {
        height: 100%;
      }
    }
  }
`

const StyledAppBar = styled(AppBar)`
  && {
    color: inherit;
    background-color: white;
    box-shadow: 1px 1px 10px #0000002b;
  }
`

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  padding-top: 47px;
  background: ${({backgroundColor}) => backgroundColor || 'white'};

  .screen-container {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }
`

const PosedContainer = posed(Container)({
  active: { x: 0, transition: { duration: 300 } },
  inactive: { x: -150, transition: { duration: 700 } }
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.direction || 'left'} ref={ref} {...props} />;
})

@observer
class BaseRoute extends Component {
  @observable stackId = -1
  @observable isOpened = true
  @observable optionsAnchor = null
  
  isClosed = false

  componentDidMount() {
    console.log('is mobile:', responsive.isMobile)
    if (responsive.isMobile) popupStack.push(stackId => this.stackId = stackId)
    if (this.props.close) this.props.close(this.close)
  }

  componentWillUnmount() {
    if (!this.isClosed && responsive.isMobile) popupStack.popStackId(this.stackId)
  }

  close = () => {
    this.isOpened = false
    let { history, backPath, includeQueryString } = this.props

    this.isClosed = true
    if (responsive.isMobile) popupStack.pop()
    setTimeout(() => {
      let querystring = includeQueryString ? window.location.search : ''
      if (backPath) return history.replace(`${backPath}${querystring}`)
      else history.goBack()
    }, 300)
  }

  renderMenuOptions() {
    return (
      <div>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={async e => {
            this.optionsAnchor = e.currentTarget
          }}
          color="inherit"
        >
          <MDIcon icon="dots-vertical" />
        </IconButton>
        <Menu
          elevation={1}
          anchorEl={this.optionsAnchor}
          open={Boolean(this.optionsAnchor)}
          onClose={() => this.optionsAnchor = null}
          PaperProps={{style:{ boxShadow: '1px 1px 10px #0000002b' }}}
        >
          {this.props.menuOptions.map((option, i) => (
            <ListItem onClick={() => {
              this.optionsAnchor = null
              option.onClick()
            }} button key={i}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </Menu>
      </div>
    )
  }

  renderMobileView() {
    let { direction, menuOptions = [] } = this.props
    let { title, children, backgroundColor, id = '' } = this.props
    let isAtTop = popupStack.popups.length > 0 
      && popupStack.popups[popupStack.popups.length - 1] === this.stackId
    let pose = isAtTop ? 'active' : 'inactive'

    return (
      <MediaQuery maxWidth={800}>
        <Dialog 
          fullScreen 
          open={this.isOpened} 
          onClose={this.close} 
          direction={direction}
          TransitionComponent={Transition}
        >
          <PosedContainer 
            backgroundColor={backgroundColor} 
            pose={pose} 
            initialPose="active" 
            withParent={false}  >
            <StyledAppBar >
              <StyledToolbar>
                <div className="logo" >
                  <img src="/images/blockchain.png" alt="" />
                </div>

                <div className="left" >
                  <IconButton edge="start" color="inherit" onClick={this.close}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography style={{flex: 1}} variant="h6">
                    {title || 'Popup Page'}
                  </Typography>
                </div>
                {menuOptions.length > 0 && this.renderMenuOptions()}
              </StyledToolbar>
            </StyledAppBar>
            <div id={id} className="screen-container" onScroll={this.props.onScroll}>
              {
                React.Children.map(children, child => React.cloneElement(child, {
                  stackId: this.stackId
                }))
              }
            </div>
          </PosedContainer>
        </Dialog>
      </MediaQuery>
    )
  }

  renderWebView() {
    let { children } = this.props

    return (
      <MediaQuery minWidth={800}>
        {children}
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

export default withRouter(BaseRoute)