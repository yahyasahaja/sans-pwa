import React, {Component, Fragment} from 'react'
import {Grid, Icon, IconButton, Avatar} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {pictureStyles} from './styles/profileStyles'

class Picture extends Component{
  render(){
    const {classes} = this.props
    return (
      <Fragment>
        <Grid container
          className  = {classes.base}
          direction  = 'column'
          alignItems = 'center'
          justify    = 'center'> 
          <IconButton>
            <Avatar className = {classes.avatar}>
              <Icon className = {classes.icon}>person_add</Icon>
            </Avatar>
          </IconButton>
        </Grid> 
      </Fragment>
    )
  }
}

export default withStyles(pictureStyles)(Picture)