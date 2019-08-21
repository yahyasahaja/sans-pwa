import React, { Component } from 'react'

import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observe } from 'mobx'
import posed from 'react-pose'
import styles from './css/auth.module.scss'
import SplitText from 'react-pose-text'
import MediaQuery from 'react-responsive'

import Login from './Login'
import Register from './Register'

import authState from './authState'
import { user, token } from '../../services/stores'
import VerifyEmail from './VerifyEmail';

const MobileContainer = posed.div({
  [authState.STATE_OPEN_MOBILE_CONTAINER]: {
    opacity: 1
  },
  [authState.STATE_CLOSE_MOBILE_CONTAINER]: {
    opacity: 0
  },
})

const Container = posed.div({
  [authState.STATE_CHANGE_TO_LOGIN]: {
    minWidth: '500px',
  },
  [authState.STATE_CHANGE_TO_REGISTER]: {
    minWidth: '600px',
  },
  [authState.STATE_OPEN_LOGIN]: {
    transform: 'translateX(0%)',
    minWidth: '500px',
    transition: { duration: 700, type: 'tween', ease: 'easeOut' },
  },
  [authState.STATE_CLOSE_LOGIN]: {
    transform: 'translateX(100%)',
    minWidth: '500px',
    transition: { duration: 700 },
  },
  [authState.STATE_OPEN_REGISTER]: {
    transform: 'translateX(0%)',
    minWidth: '600px',
    transition: { duration: 700 },
  },
  [authState.STATE_CLOSE_REGISTER]: {
    transform: 'translateX(100%)',
    minWidth: '600px',
    transition: { duration: 700 },
  },
})

const Content = posed.div({
  [authState.STATE_OPEN_CONTENT]: {
    transform: 'translate(0px, 0px)',
    opacity: 1,
    transition: { duration: 700 },
    delay: 700,
  },
  [authState.STATE_CLOSE_CONTENT]: {
    transform: 'translate(10px, 10px)',
    opacity: 0,
    transition: { duration: 700 },
  },
})

const charPoses = {
  exit: { 
    opacity: 0, 
    y: 20,
    delay: ({ charIndex }) => charIndex * 30
  },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 30 + 1500
  }
}

@observer
class Auth extends Component {
  componentDidMount() {
    setTimeout(() => {
      if (window.location.pathname.indexOf('login') !== -1) {
        authState.containerPose = authState.STATE_OPEN_LOGIN
      } else {
        authState.containerPose = authState.STATE_OPEN_REGISTER
      }
      authState.containerPose = authState.STATE_OPEN_CONTENT
    }, 100)

    if (user.isLoggedIn) this.props.history.replace(
      `/${user.data.role === 'ROLE_COMPANY' ? 'company' : 'customers'}/dashboard`
    )

    this.userDisposer = observe(user, 'isLoggedIn', data => {
      if (data.oldValue === data.newValue) return
      if (data.newValue) authState.gotoHomePage(this)
    })

    this.tokenDisposer = observe(token, 'isSettingUp', data => {
      if (data.oldValue === data.newValue) return
      if (!data.newValue) {
        if (!user.isLoggedIn) {
          user.logout()
        } else {
          authState.gotoHomePage(this)
        }
      }
    })
  }

  unsubscribeAuthStateChanged = () => {}

  componentWillUnmount() {
    if (this.userDisposer) this.userDisposer()
    if (this.tokenDisposer) this.tokenDisposer()
    authState.resetState()
  }

  animateText(text) {
    return (
      <SplitText 
        initialPose={authState.STATE_EXIT_TEXT} 
        pose={authState.textPose} 
        charPoses={charPoses}
      >
        {text}
      </SplitText>
    )
  }

  renderRoute() {
    return (
      <Switch>
        <Route path="/auth/signup/verify" component={VerifyEmail} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
        <Redirect from="/auth" to="/auth/login" />
      </Switch>
    )
  }

  render() {
    return (
      <div className={styles.container} >
        <MediaQuery minWidth={800}>
          <div className={styles.left} >
            <Link to="/" className={styles.title} >
              {this.animateText('Jobwher')}
            </Link>
            <span className={styles.desc}>
              {this.animateText('A decentralized global network for job seekers')}
            </span>
          </div>

          <Container 
            initialPose={authState.STATE_CLOSE_LOGIN} 
            pose={authState.containerPose} 
            className={styles.wrapper}>
            <Content 
              initialPose={authState.STATE_CLOSE_CONTENT}
              pose={authState.contentPose} 
              className={styles.content}>
              {this.renderRoute()}
            </Content>
          </Container>
        </MediaQuery>

        <MediaQuery maxWidth={800}>
          <MobileContainer 
            pose={authState.mobileContainerPose}
            initialPose={authState.STATE_CLOSE_MOBILE_CONTAINER}
            className={styles.wrapper} style={{width: '100%'}}
          >
            <div className={styles.content}>
              {this.renderRoute()}
            </div>
          </MobileContainer>
        </MediaQuery>
      </div>
    )
  }
}

export default Auth