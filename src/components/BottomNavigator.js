import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import styled from 'styled-components'

import customersState from '../screens/Customers/customersState'
import styles from './css/bottom-navigator.module.scss'
import companyState from '../screens/Company/companyState';

const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    width: 100%;
    height: 47px;

    .MuiBottomNavigationAction-root {
      min-width: 50px;
    }
  }
`

@observer
class Navigator extends Component {
  contentState = customersState

  componentDidMount() {
    this.contentState.selectedMenuRoute = 0
  }

  renderMenus() {
    if (this.props.data) 
      return this.props.data.map((d, i) => (
      <BottomNavigationAction key={i} label={d.label} value={d.path} icon={
        <div className={
          `${styles.icon} mdi mdi-${d.icon}${
            d.outline && this.contentState.selectedPath !== d.path ? '-outline' : ''
          }`} 
        />
      }/>
    ))
  }

  render() {
    let { history, data, company } = this.props

    if (company) this.contentState = companyState

    return (
      <div className={styles.container} >
        {
          data && (
            <StyledBottomNavigation
              value={this.contentState.selectedPath} 
              onChange={(e, path) => {
                let route = data.find(v => v.path === path)

                if (route) {
                  this.contentState.selectedRoute = route
                  if (route.onClick) {
                    route.onClick()
                    return
                  }
                }

                history.push(path)
                this.contentState.selectedPath = path
              }}
            >
              {this.renderMenus()}
            </StyledBottomNavigation>
          )
        }
      </div>
    )
  }
}

export default withRouter(Navigator)