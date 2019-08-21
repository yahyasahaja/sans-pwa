import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'

import MDIcon from '../../components/MDIcon'

const StyledList = styled(List)`
  && {
    display: block;
    width: 300px;
  }

  .item {
    margin: 0 4px;
    font-size: 12pt;
    border: 1px solid #ffffff00;
    border-radius: 30px;
    transition: .3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #545454;

    &:active {
      opacity: .3;
      transition: .01s;
    }

    .label {
      margin-left: 10px;
    }
  }
`

const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  transition: .3s;
  background: ${({appear}) => appear ? 'rgba(255, 255, 255, .9)' : 'rgba(255, 255, 255, 0)'};
  color: ${({appear}) => appear ? 'inherit' : 'white'};
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  align-items: center;
  box-shadow: ${({appear}) => appear ? '0px 0px 27px 1px #8c8c8c80' : 'none'};

  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .logo {
      height: 30px;
  
      img {
        height: 100%;
      }
    }
  }

  .menu {
    display: flex;

    .menu-icon {
      font-size: 20pt;
      color: ${({appear}) => appear ? 'inherit' : 'white'};

      &:hover {
        border: ${({appear}) => appear ? '1px solid #000000ff' : '1px solid #ffffffff'};
      }

      &:active {
        opacity: .3;
      }
    }
  }
`

@observer
class TopBar extends Component {
  @observable appear = false
  @observable containerPose = 'open'
  @observable isOpened = false

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  onScroll = () => {
    // console.log(window.scrollY)
    if (window.scrollY > 250) {
      this.appear = true
    } else {
      this.appear = false
    }
  }

  menu = [
    {
      icon: 'home',
      label: 'Home',
      tag: '#home',
    },
    {
      icon: 'star-circle-outline',
      label: 'Features',
      tag: '#features',
    },
    {
      icon: 'information',
      label: 'About',
      tag: '#about',
    },
    {
      icon: 'exit-to-app',
      label: 'Login',
      path: '/auth/login',
    },
  ]

  render() {
    return(
      <TopBarContainer appear={this.appear}>
        <Link className="logo-wrapper" to="/" >
          <div className="logo" >
            <img src={
              !this.appear ? '/images/jw_logo_mark.svg' : '/images/jw_logo_c.svg'
            } alt="logo" />
          </div>
        </Link>
        <div className="menu" >
          <MDIcon onClick={() => this.isOpened = true} className="menu-icon" icon="menu" />

          {/* {this.menu.map((d, i) => d.tag ? (
            <AnchorLink key={i} className="item" href={d.tag}>
              <MDIcon icon={d.icon} />
              <div className="label" >{d.label}</div>
            </AnchorLink>
          )
          : (
            <Link to={d.path} className="item" key={i} >
              <MDIcon icon={d.icon} />
              <div className="label" >{d.label}</div>
            </Link>
          ))} */}
        </div>
        <Drawer anchor="right" open={this.isOpened} onClose={() => this.isOpened = false}>
          <StyledList>
            {this.menu.map((d, i) => {
              if (d.tag) return (
                <AnchorLink 
                  onClick={() => this.isOpened = false} 
                  key={i} 
                  className="item" href={d.tag}>
                  <ListItem button key={i}>
                  <MDIcon icon={d.icon} />
                  <div className="label" >{d.label}</div>
                  </ListItem>
                </AnchorLink>
              )

              return (
                (
                  <Link to={d.path} className="item" key={i} >
                    <ListItem button key={i}>
                    <MDIcon icon={d.icon} />
                    <div className="label" >{d.label}</div>
                    </ListItem>
                  </Link>
                )
              )
            })}
          </StyledList>
        </Drawer>
      </TopBarContainer>
    )
  }
}

export default TopBar