import React, { Component } from 'react'

import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observable, observe } from 'mobx'
import posed from 'react-pose'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import styled from 'styled-components'
import BottomNavigator from '../../components/BottomNavigator'
import MediaQuery from 'react-responsive'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import styles from './company.module.scss'

import companyState from './companyState'
import { user, snackbar, token, responsive } from '../../services/stores'

// import Jobs from './Jobs'
// import TopNavigator from '../../components/TopNavigator'
// import Dashboard from './Dashboard'
// import Profile from './Profile'
// import Menu from './Menu'

const Jobs = React.lazy(() => import('./Jobs'))
const Profile = React.lazy(() => import('./Profile'))
const Account = React.lazy(() => import('./Account'))
const Menu = React.lazy(() => import('./Menu'))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

const StyledAppBar = styled(AppBar)`
  && {
    padding: 0px;
    background: white;
    color: #424242;
    /* border-bottom: 1px solid #dadada; */
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.06), 
    0px 4px 5px 0px rgba(0, 0, 0, 0), 
    0px 1px 24px 0px rgba(0,0,0,0.12);
  }
`

const StyledToolbar = styled(Toolbar)`
  && {
    justify-content: space-between;
    min-height: unset;
    min-width: ${props => props.width}
  }
`

const StyledListItem = styled(ListItem)`
  && {
    height: 43px;
    width: 300px;
    color: inherit;
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    &.Mui-selected, &.Mui-selected:hover {
      background: rgba(0, 0, 0, 0.37);
    }
  }
`

const WebContainer = styled.div`
  display: flex;
`

const ContentContainer = styled.div`
  @media only screen and (min-width: 800px) {
    display: block;
    flex: 1;
  }
`

const PosedContainer = posed(ContentContainer)({
  [companyState.STATE_OPEN_CONTAINER]: {
    opacity: 1,
    transition: { duration: 700 },
  },
  [companyState.STATE_CLOSE_CONTAINER]: {
    opacity: 0,
    transition: { duration: 700 },
  },
})

const StyledDrawer = styled.div`
  && {
    display: block;
    background: white;
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    height: 100vh;
    z-index: 1300;

    .MuiDrawer-paper {
      position: relative;
      overflow-x: hidden;
      overflow-y: auto;
      height: 100vh;
      background: #34495e;
      color: white;

      .MuiSvgIcon-root{
        color: white;
      }
    }

    .drawer-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      .logo {
        width: 100%;
        padding: 0 10px;
        margin-bottom: 10px;
        max-height: 50px;
        cursor: pointer;

        &.active {
          padding: 0 20px;
          margin-bottom: 20px;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
`

const BackDrawer = styled.div`
  display: block;
  background: white;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  height: 100vh;
`

const PosedBackDrawer = posed(BackDrawer)({
  active: {
    width: 250,
    transition: { duration: 500 },
  },
  inactive: {
    width: 50,
    transition: { duration: 500 },
  },
})

const PosedDrawer = posed(StyledDrawer)({
  active: {
    width: 250,
    transition: { duration: 500 },
  },
  inactive: {
    width: 50,
    transition: { duration: 500 },
  },
})

@observer
class Company extends Component {
  @observable isOpened = false
  @observable isShouldLoginDialogOpened = false
  @observable menuRouters = []
  @observable routers = []
  @observable isLogoutDialogOpened = false
  @observable isMobile = false

  constructor(props) {
    super(props)
    this.initAuthorizedRouters()
  }

  componentWillReceiveProps(props) {
    if (this.props.location.pathname !== props.location.pathname) companyState.updateRoute()
  }

  componentDidMount() {
    companyState.updateRoute()
    let match = window.matchMedia('(max-width: 800px)')
    
    if (match.matches) {
      this.isMobile = true
    }

    if (user.isLoggedIn && user.data && user.data.role === 'ROLE_CANDIDATE') 
      this.props.history.replace('/customers/dashboard')

    if (user.isLoggedIn) this.initAuthorizedRouters()
    this.userDisposer = observe(user, 'isLoggedIn', data => {
      if (data.oldValue === data.newValue) return
      if (data.newValue) {
        this.initAuthorizedRouters()
        if (data.newValue.role === 'ROLE_CANDIDATE') 
          this.props.history.replace('/customers/dashboard')
      } else {
        this.props.history.replace('/auth/login')
      }
    })

    companyState.checkDrawerStatus()

    this.tokenDisposer = observe(token, 'isSettingUp', data => {
      if (data.oldValue === data.newValue) return
      if (!data.newValue) {
        if (user.isLoggedIn) {
          this.gotoCustomersPage()
        } else {
          this.props.history.replace('/auth/login')
        }
      }
    })

    if (!token.isSettingUp) {
      if (!user.isLoggedIn) this.props.history.replace('/auth/login')
    }
  }

  gotoCustomersPage = () => {
    if (user.isLoggedIn && user.data && user.data.role === 'ROLE_CANDIDATE') 
      this.props.history.replace('/customers/dashboard')
  }

  initAuthorizedRouters() {
    this.routers = [
      {
        icon: 'briefcase',
        label: 'Jobs',
        path: companyState.PATH_JOBS,
        outline: true,
      },
    ]

    if (responsive.isMobile) {
      this.routers.push({
        icon: 'clipboard-account',
        label: 'Profile',
        path: companyState.PATH_PROFILE
      })
      this.routers.push(
        {
          icon: 'menu',
          label: 'Menu',
          path: companyState.PATH_MENU,
        },
      )
    }

    this.menuRouters = [
      {
        icon: 'account-circle',
        label: 'Account',
        path: companyState.PATH_ACCOUNT
      },
      {
        icon: 'bell',
        label: 'Test Notification',
        onClick: () => snackbar.show('Notification sent!')
      },
      {
        icon: 'logout',
        label: 'Logout',
        onClick: this.logout
      }
    ]

    if (!responsive.isMobile) this.menuRouters.unshift({
      icon: 'clipboard-account',
      label: 'Profile',
      path: companyState.PATH_PROFILE
    })
  }

  componentWillUnmount() {
    if (this.userDisposer) this.userDisposer()
    companyState.resetState()
  }

  openShouldLoginDialog = () => {
    this.isShouldLoginDialogOpened = true
  }

  logout = async () => {
    this.isLogoutDialogOpened = true
  }

  renderDialogs() {
    return (
      <React.Fragment>
        <Dialog
          open={this.isShouldLoginDialogOpened}
          TransitionComponent={Transition}
          onClose={() => {
            this.isShouldLoginDialogOpened = false
          }}
        >
          <DialogTitle>Login Alert</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You have to login due to access it!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.isShouldLoginDialogOpened = false} color="secondary">
              Nope
            </Button>
            <Button onClick={() => {
              this.props.history.push('/auth/login')
            }} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.isLogoutDialogOpened}
          TransitionComponent={Transition}
          fullWidth
          onClose={() => {
            this.isLogoutDialogOpened = false
          }}
        >
          <DialogTitle>Logout Alert</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Continue logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.isLogoutDialogOpened = false} color="secondary">
              Nope
            </Button>
            <Button onClick={() => {
              user.logout()
              this.props.history.push('/auth/login')
            }} color="primary">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }

  renderDrawer() {
    let c = companyState
    let logoUrl = c.drawerPose === 'active' 
      ? '/images/jw_logo_w.svg'
      : '/images/jw_logo_mark.svg'
    return (
      <React.Fragment>
        <PosedDrawer
          pose={c.drawerPose}
          initialPose="active"
        >
          <Drawer
            className={styles.drawer}
            variant="permanent"
          >
            <div className="drawer-wrapper" >
              <div className="drawer-list">
                <StyledListItem button onClick={() => {
                  c.toggleDrawerStatus()
                }}>
                  <ListItemIcon>
                    {
                      c.drawerPose === 'inactive' 
                        ? <ChevronRightIcon className={styles.gicon} /> 
                        : <ChevronLeftIcon className={styles.gicon} />
                      }
                  </ListItemIcon>
                  <ListItemText primary="" />
                </StyledListItem>
                <Divider/>
                <List className={styles.lists}>
                  {this.routers.map((d, i) => {
                    if (d.devider) return (
                      <Divider key={i} />
                    )

                    let TheList = 
                      <StyledListItem 
                        button
                        onClick={d.onClick}
                        key={i}
                        selected={d.path === companyState.selectedPath}
                      >
                        <ListItemIcon>
                          <span className={`mdi mdi-${d.icon} ${styles.icon}`} />
                        </ListItemIcon>
                          <ListItemText primary={d.label} />
                      </StyledListItem>

                    if (d.onClick) return TheList

                    return (
                      <Link 
                        to={d.path || '/company/jobs'} 
                        className={styles.list} key={i} >
                        {TheList}
                      </Link>
                    )
                  })}
                </List>
                <Divider/>
                <List className={styles.lists}>
                  {this.menuRouters.map((d, i) => {
                    if (d.devider) return (
                      <Divider key={i} />
                    )

                    let TheList = 
                      <StyledListItem 
                        button
                        onClick={d.onClick}
                        key={i}
                        selected={d.path === companyState.selectedPath}
                      >
                        <ListItemIcon>
                          <span className={`mdi mdi-${d.icon} ${styles.icon}`} />
                        </ListItemIcon>
                          <ListItemText primary={d.label} />
                      </StyledListItem>

                    if (d.onClick) return TheList

                    return (
                      <Link 
                        to={d.path || '/company/jobs'} 
                        className={styles.list} key={i} >
                        {TheList}
                      </Link>
                    )
                  })}
                </List>
              </div>

              <Link to="/" className={`logo ${c.drawerPose}`} >
                <img src={logoUrl} alt="" />
              </Link>
            </div>
          </Drawer>
        </PosedDrawer>
        <PosedBackDrawer 
          pose={c.drawerPose}
          initialPose="active"
        />
      </React.Fragment>
    )
  }

  renderContentContainer() {
    let c = companyState
    return (
      <PosedContainer 
        pose={companyState.containerPose} 
        className={styles.container}
        initialPose={companyState.STATE_CLOSE_CONTAINER}
      >
        <Switch>
          <Route path={c.PATH_JOBS} component={Jobs} />
          <Route path={c.PATH_PROFILE} component={Profile} />
          <Route path={c.PATH_ACCOUNT} component={Account} />
          <Route path={c.PATH_MENU} render={props => <Menu 
            {...props}
            list={this.menuRouters}
          />} />
          <Redirect from="*" to="/company/jobs" />
        </Switch>
      </PosedContainer>
    )
  }

  renderMobileView() {
    let selectedRoute = companyState.selectedRoute 
    
    return (
      <MediaQuery maxWidth={800}>
        <StyledAppBar
          position="fixed"
        >
          <StyledToolbar width="200px" >
            <Link className={styles.info} to="/" >
              <div className={styles.logo} >
                <img src="/images/jw_logo_mark_c.svg" alt="logo" />
              </div>

              <span className={styles.title}>{
                selectedRoute && selectedRoute.label
              }</span>
            </Link>
          </StyledToolbar>
        </StyledAppBar>
        {this.renderContentContainer()}
        <BottomNavigator company data={this.routers} />
      </MediaQuery>
    )
  }

  renderWebView() {
    return (
      <MediaQuery minWidth={800}>
        <WebContainer>
          {this.renderDrawer()}
          {this.renderContentContainer()}
        </WebContainer>
      </MediaQuery>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.wrapper} >
          {this.renderMobileView()}
          {this.renderWebView()}
        </div>

        {this.renderDialogs()}
      </React.Fragment>
    )
  }
}

export default Company