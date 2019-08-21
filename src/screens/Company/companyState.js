import { observable, action } from 'mobx'
import { COMPANY_DRAWER_STATUS_URI } from '../../config'

class CompanyState {
  STATE_OPEN_CONTAINER = 'opencontainer'
  STATE_CLOSE_CONTAINER = 'closecontainer'
  STATE_OPEN_DRAWER = 'opendrawer'
  STATE_CLOSE_DRAWER = 'closedrawer'
  
  //PATHS: 5
  //JOBS PATH
  PATH_JOBS = '/company/jobs'
  PATH_MENU = '/company/menu'
  
  //PROFILE PATH
  PATH_PROFILE = '/company/profile'
  PATH_ACCOUNT = '/company/account'

  @observable containerPose = this.STATE_OPEN_CONTAINER
  @observable drawerPose = this.STATE_OPEN_DRAWER
  @observable selectedPath = this.PATH_JOBS
  @observable selectedRoute = null
  @observable drawerPose = 'active'

  @action
  resetState() {
    this.containerPose = this.STATE_OPEN_CONTAINER
    this.drawerPose = this.STATE_OPEN_DRAWER
    // this.drawerPose = 'active'
  }

  @action
  toggleDrawerStatus() {
    this.drawerPose = this.drawerPose === 'active' ? 'inactive' : 'active'
    localStorage.setItem(COMPANY_DRAWER_STATUS_URI, this.drawerPose)
  }

  @action
  checkDrawerStatus() {
    this.drawerPose = localStorage.getItem(COMPANY_DRAWER_STATUS_URI) || 'active'
  }

  @action
  updateRoute() {
    let path = window.location.pathname

    if (path.indexOf(this.PATH_JOBS) !== -1) {
      this.selectedPath = this.PATH_JOBS
    }if (path.indexOf(this.PATH_MENU) !== -1) {
      this.selectedPath = this.PATH_MENU
    } else if (path.indexOf(this.PATH_PROFILE) !== -1) {
      this.selectedPath = this.PATH_PROFILE
    } else if (path.indexOf(this.PATH_ACCOUNT) !== -1) {
      this.selectedPath = this.PATH_ACCOUNT
    }
  }
}

export default window.companyState = new CompanyState()