import { observable, action } from 'mobx'
import { user } from '../../services/stores'
// import axios from 'axios'

class AuthState {
  STATE_CHANGE_TO_LOGIN = 'changelogin'
  STATE_CHANGE_TO_REGISTER = 'changeregister'
  STATE_OPEN_LOGIN = 'openlogin'
  STATE_OPEN_REGISTER = 'openregister'
  STATE_CLOSE_LOGIN = 'closelogin'
  STATE_CLOSE_REGISTER = 'closeregister'
  STATE_OPEN_CONTENT = 'opencontent'
  STATE_CLOSE_CONTENT = 'closecontent'
  STATE_ENTER_TEXT = 'enter'
  STATE_EXIT_TEXT = 'exit'
  STATE_OPEN_MOBILE_CONTAINER = 'mobilecontaineropen'
  STATE_CLOSE_MOBILE_CONTAINER = 'mobilecontainerclose'

  @observable containerPose = this.STATE_CLOSE_LOGIN
  @observable mobileContainerPose = this.STATE_OPEN_MOBILE_CONTAINER
  @observable contentPose = this.STATE_CLOSE_CONTENT
  @observable textPose = this.STATE_ENTER_TEXT

  gotoHomePage(component) {
    this.containerPose = this.STATE_CLOSE_LOGIN
    this.textPose = this.STATE_EXIT_TEXT
    this.mobileContainerPose = this.STATE_CLOSE_MOBILE_CONTAINER
    setTimeout(() => {
      if (user.data.role === 'ROLE_COMPANY') {
        component.props.history.push('/company/jobs')
      } else {
        component.props.history.push('/customers/dashboard')
      }
    }, 1500);
  }

  @action
  resetState() {
    this.containerPose = this.STATE_CLOSE_LOGIN
    this.contentPose = this.STATE_CLOSE_CONTENT
    this.textPose = this.STATE_ENTER_TEXT
    this.mobileContainerPose = this.STATE_OPEN_MOBILE_CONTAINER
  }
}

export default window.authState = new AuthState()