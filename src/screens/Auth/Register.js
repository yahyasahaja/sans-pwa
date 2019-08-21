import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
// import Icon from '@material-ui/core/Icon'
import InputIcon from '@material-ui/icons/Input'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import styles from './css/register.module.scss'
import CircularProgress from '@material-ui/core/CircularProgress'
import { user, token } from '../../services/stores'
import authState from './authState'
import SwipeableViews from 'react-swipeable-views'
// import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const StyledTabs = styled(Tabs)`
  && {
    background: white;
    box-shadow: none;
  }
`

const StyledButton = styled(Button)`
  && {
    background-color: white;
    border: 1px solid #cccccc;

    &:hover {
      background: #f1f1f1;
    }
    
    .MuiButton-label {
      color: #585858;
      text-transform: none;
      display: flex;
      height: 20px;

      img {
        height: 100%;
        margin: 10px;
      }
    }
  }
`

@observer
class Register extends Component {
  @observable shouldShowPassword = false
  @observable webAddress = ''
  @observable email = ''
  @observable password = ''
  @observable currentTab = 0
  @observable registerSuccess = false

  componentWillUnmount() {
    if (this.tokenDisposer) this.tokenDisposer()
  }

  handleChange(name, value) {
    this[name] = value.target.value
  }

  handleClickShowPassword = () => {
    this.shouldShowPassword = !this.shouldShowPassword
  }

  renderButton() {
    if (user.isLoadingLogin) return <CircularProgress className={styles.loading} /> 

    return (
      <React.Fragment>
        <Button 
          fullWidth 
          size="large"
          variant="contained" 
          color="primary"
          style={{marginTop: 20, color: 'white'}}
          type="submit"
        >
          Register
          <InputIcon style={{marginLeft: 10}} />
        </Button>
        {
          this.currentTab === 0 && (
            <StyledButton 
              fullWidth 
              size="large"
              variant="contained" 
              color="primary"
              style={{marginTop: 20, color: 'white'}}
              onClick={async e => {
                e.preventDefault()
                user.loginWithGoogle()
              }}
            >
              <img src="/images/google-logo.png" alt="" />
              Register with Google
            </StyledButton>
          )
        }
      </React.Fragment>
    )
  }

  onSubmit = async e => {
    e.preventDefault()

    let {
      email,
      webAddress,
      password,
      currentTab,
    } = this

    let role = currentTab === 0
      ? 'ROLE_CANDIDATE'
      : 'ROLE_COMPANY'

    let body = {
      email,
      password,
      role
    }

    if (role === 'ROLE_COMPANY') {
      body.webAddress = webAddress.replace(/^(http[s]?:\/\/www\\.|http[s]?:\/\/|www\\.)/, "")
    }

    let res = await user.register(body)
    if (res) this.registerSuccess = true
  }

  renderCustomerForm() {
    return (
      <form 
        onSubmit={this.onSubmit} 
      >
        <TextField
          name="email"
          type="email"
          label="Email"
          className={styles.input}
          onChange={this.handleChange.bind(this, 'email')}
          value={this.email}
          fullWidth
          rowsMax={6}
          required
          margin="normal"
          variant="outlined"
        />

        <div className={styles['password-wrapper']}>
          <TextField
            name="password"
            type={this.shouldShowPassword ? 'text' : 'password'}
            label="Password"
            className={styles.password}
            onChange={this.handleChange.bind(this, 'password')}
            value={this.password}
            required
            fullWidth
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.shouldShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {this.renderButton()}
      </form>
    )
  }

  renderRealEstateForm() {
    return (
      <form 
        onSubmit={this.onSubmit} 
      >
        <TextField
          name="web"
          type="text"
          label="Company Web Address"
          className={styles.input}
          onChange={this.handleChange.bind(this, 'webAddress')}
          value={this.webAddress}
          placeholder="example.com"
          fullWidth
          rowsMax={6}
          required
          margin="normal"
          variant="outlined"
        />

        <TextField
          name="email"
          type="email"
          label="Company Email"
          className={styles.input}
          onChange={this.handleChange.bind(this, 'email')}
          value={this.email}
          placeholder="admin@example.com"
          fullWidth
          rowsMax={6}
          required
          margin="normal"
          variant="outlined"
        />

        <div className={styles['password-wrapper']}>
          <TextField
            name="password"
            type={this.shouldShowPassword ? 'text' : 'password'}
            label="Password"
            className={styles.password}
            onChange={this.handleChange.bind(this, 'password')}
            value={this.password}
            required
            fullWidth
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.shouldShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {this.renderButton()}
      </form>
    )
  }

  renderRegister() {
    return (
      <React.Fragment>
        <StyledTabs
          value={this.currentTab}
          onChange={(e, v) => this.currentTab = v}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Job Seeker" />
          <Tab label="Company" />
        </StyledTabs>
        <SwipeableViews
          index={this.currentTab}
          onChangeIndex={(e, v) => this.currentTab = v}
        >
          {this.renderCustomerForm()}
          {this.renderRealEstateForm()}
        </SwipeableViews>
      </React.Fragment>
    )
  }

  render() {
    if (token.isSettingUp) return (
      <div className={styles['loading-wrapper']} >
        <CircularProgress className={styles.loading} /> 
      </div>
    )

    return (
      <div
        className={styles.container} 
      >
        <div className={styles.logo} >
          <img src="/images/jw_logo_mark_c.svg" alt=""/>
        </div>

        <h1>Register</h1>
        {
          !this.registerSuccess
            ? this.renderRegister()
            : (
              <div className={styles.success} >
                <div>
                  Your account has been 
                  <span className={styles.highlight} > registered successfully</span>, 
                  check your email to active it.
                  <div className={styles.notreceive} >
                    Have not received email? 
                    <div className={styles.send} > 
                      {
                        user.isResendingEmail
                          ? (
                            <CircularProgress /> 
                          )
                          : (
                            <Button
                              onClick={async () => {
                                await user.resendEmail(this.email)
                              }}
                              variant="outlined" 
                              color="primary">
                              Resend
                            </Button>
                          )
                      }
                    </div>
                  </div>
                </div>
              </div>
            )
        }
        
        <p>Already have an account? <Link 
          to="/auth/login" 
          onClick={
            () => {
              authState.containerPose = authState.STATE_CHANGE_TO_LOGIN
              authState.contentPose = authState.STATE_OPEN_CONTENT
            }
          }
        >
          Login
        </Link></p>
      </div>
    )
  }
}

export default Register