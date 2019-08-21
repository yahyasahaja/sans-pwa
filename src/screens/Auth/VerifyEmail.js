import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import styles from './css/login.module.scss'
import CircularProgress from '@material-ui/core/CircularProgress'
import { user } from '../../services/stores'

@observer
class VerifyEmail extends Component {
  @observable shouldShowPassword = false
  @observable email = ''
  @observable password = ''
  @observable resendEmail = ''
  
  componentDidMount() {
    this.verifyEmail()
  }
  
  async verifyEmail() {
    user.logout()
    let success = await user.verifyEmail()
    this.props.history.push('/auth/login', {
      message: success ? 'Your email has been verified, please login' : ''
    })
  }

  render() {
    return (
      <div className={styles['loading-wrapper']} >
        <CircularProgress className={styles.loading} /> 
        <div className={styles.verify} >Verifying your email...</div>
      </div>
    )
  }
}

export default VerifyEmail