import { observable, action } from 'mobx'
import React from 'react'
import AddIcon from '@material-ui/icons/Add'

class Fab {
  @observable isActive = false 
  @observable bottomPosition = 60
  onClick = () => {}
  icon = <AddIcon />

  @action
  show() {
    this.isActive = true
  }

  @action
  hide() {
    this.isActive = false
  }
}

export default new Fab()