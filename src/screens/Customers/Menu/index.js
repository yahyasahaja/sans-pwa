import React, { Component } from 'react'
import BaseRoute from '../../../components/BaseRoute'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import styled from 'styled-components'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import { Link } from 'react-router-dom'
import posed from 'react-pose'
import { observable } from 'mobx'

import MDIcon from '../../../components/MDIcon'

const Container = styled.div`
  display: block;
  width: 100%;
  position: relative;
  min-height: 100%;
  background: white;
  
  @media (max-width: 480px) {
    padding-bottom: 60px;
  }

  .list {
    width: 100%;
    display: block;
    color: inherit;
  }
`

const PosedContainer = posed(Container)({
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 500 },
  },
  close: {
    opacity: 0,
    y: -20,
    transition: { duration: 500 },
  },
})

const StyledListItem = styled(ListItem)`
  && {
    height: 43px;
    color: inherit;
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`

export default class Menu extends Component {
  @observable containerPose = 'open'

  render() {
    return (
      <BaseRoute>
        <PosedContainer
          pose={this.containerPose} 
          initialPose="close"
          withParent={false}
        >
          <List>
            {this.props.list.map((d, i) => {
              if (d.devider) return (
                <Divider key={i} />
              )

              let TheList = 
                <StyledListItem 
                  button
                  onClick={d.onClick}
                  key={i}
                  style={{color: 'inherit'}}
                >
                  <ListItemIcon>
                    <MDIcon icon={d.icon} />
                  </ListItemIcon>
                    <ListItemText primary={d.label} />
                </StyledListItem>

              if (d.onClick) return TheList

              return (
                <Link 
                  className="list"
                  to={d.path || '/customers/jobs'} 
                  key={i} >
                  {TheList}
                </Link>
              )
            })}
          </List>
        </PosedContainer>
      </BaseRoute>
    )
  }
}
