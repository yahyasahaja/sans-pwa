import React, {Component, Fragment} from 'react'
import {Grid} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import Picture from './Picture' 
import Inputform from './wrapper/Inputform'
import Submit from './wrapper/Submit'
import {containerStyles} from './styles/profileStyles'

class Container extends Component{
  render(){
    const {classes} = this.props
    return (
      <Fragment>
        <Grid container
          className  = {classes.base} 
          direction  = 'column'
          alignItems = 'center'>
          <Picture />
          <Inputform name = 'First name'/>
          <Inputform name = 'Last name'/>
          <Inputform name = 'Description'/>
          <Inputform name = 'Country'/>
          <Inputform name = 'Adress'/>
          <Inputform name = 'Industry'/>
          <Inputform name = 'Birth Date'/>
          <Inputform name = 'Others'/>
          <Submit />
        </Grid>
      </Fragment>
    )
  }
}

export default withStyles(containerStyles)(Container)