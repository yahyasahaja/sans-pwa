import React, {Component} from 'react'
import {Button, Typography} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {submitStyles} from '../styles/profileStyles'

class Submit extends Component{
  render(){
    const {classes} = this.props
    return (
      <Button 
        variant   = 'contained'
        color     = 'primary'
        className = {classes.button}>
        <Typography className = {classes.text}>submit</Typography>
      </Button>
    )
  }
}

export default withStyles(submitStyles)(Submit)