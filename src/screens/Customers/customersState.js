import { observable, action } from 'mobx'
import { CUSTOMER_DRAWER_STATUS_URI } from '../../config'

class CustomersState {
  STATE_OPEN_CONTAINER = 'opencontainer'
  STATE_CLOSE_CONTAINER = 'closecontainer'
  STATE_OPEN_DRAWER = 'opendrawer'
  STATE_CLOSE_DRAWER = 'closedrawer'
  
  //PATHS: 5
  //DASHBOARD PATH
  PATH_DASHBOARD = '/customers/dashboard'
  //JOBS PATH
  PATH_JOBS = '/customers/jobs'
  PATH_JOBS_HOME = `${this.PATH_JOBS}/home`
  PATH_JOBS_FAVORITES = `${this.PATH_JOBS}/favorites`
  
  //ACCOUNT PATH
  PATH_MENU = '/customers/menu'

  //PROFILE PATH
  PATH_PROFILE = '/customers/profile'

  //ACCOUNT PATH
  PATH_ACCOUNT = '/customers/account'

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
    localStorage.setItem(CUSTOMER_DRAWER_STATUS_URI, this.drawerPose)
  }

  @action
  checkDrawerStatus() {
    this.drawerPose = localStorage.getItem(CUSTOMER_DRAWER_STATUS_URI) || 'active'
  }

  @action
  updateRoute() {
    let path = window.location.pathname

    if (path.indexOf(this.PATH_DASHBOARD) !== -1) {
      this.selectedPath = this.PATH_DASHBOARD
    } else if (path.indexOf(this.PATH_JOBS_FAVORITES) !== -1) {
      this.selectedPath = this.PATH_JOBS_FAVORITES
    } else if (path.indexOf(this.PATH_JOBS) !== -1) {
      this.selectedPath = this.PATH_JOBS
    } else if (path.indexOf(this.PATH_VISA) !== -1) {
      this.selectedPath = this.PATH_VISA
    } else if (path.indexOf(this.PATH_HOUSING) !== -1) {
      this.selectedPath = this.PATH_HOUSING
    } else if (path.indexOf(this.PATH_PROFILE) !== -1) {
      this.selectedPath = this.PATH_PROFILE
    } else if (path.indexOf(this.PATH_ACCOUNT) !== -1) {
      this.selectedPath = this.PATH_ACCOUNT
    } else if (path.indexOf(this.PATH_MENU) !== -1) {
      this.selectedPath = this.PATH_MENU
    }
  }
}

export default window.customersState = new CustomersState()