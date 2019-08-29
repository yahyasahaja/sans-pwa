import React, {Component, Fragment} from 'react'
import {TextField} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {inputformStyles} from '../styles/profileStyles'

class Inputform extends Component{
  render(){
    const {classes} = this.props
    return (
      <Fragment>
         <TextField
          label     = {this.props.name}
          className = {classes.textField}
          margin    = "normal"
          variant   = "outlined" />
      </Fragment>
    )
  }
}

export default withStyles(inputformStyles)(Inputform)