import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import styled from 'styled-components'

import customersState from '../screens/Authorized/customersState'
import styles from './css/top-navigator.module.scss'

const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    width: 100%;
    height: 47px;
    max-width: 500px;
  }
`

@observer
class Navigator extends Component {
  renderMenus() {
    if (this.props.data) 
      return this.props.data.map((d, i) => (
      <BottomNavigationAction key={i} label={d.label} value={d.path} icon={
        <div className={
          `${styles.icon} mdi mdi-${d.icon}${
            d.outline && customersState.selectedPath !== d.path ? '-outline' : ''
          }`} 
        />
      }/>
    ))
  }

  render() {
    let { history, data } = this.props
    return (
      <div className={styles.container} >
        {
          data && (
            <StyledBottomNavigation
              value={customersState.selectedPath} 
              onChange={(e, path) => {
                let route = data.find(v => v.path === path)
                if (route) {
                  customersState.selectedRoute = route
                  if (route.onClick) {
                    route.onClick()
                    return
                  }

                  if (route.web && route.web.onClick) {
                    route.web.onClick()
                    return
                  }
                }

                history.push(path)
                customersState.selectedPath = path
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