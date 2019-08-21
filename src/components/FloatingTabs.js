import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'

const RelativeTabsContainer = styled.div`
  display: block;
  width: 100%;
  opacity: ${({isFloating}) => !isFloating ? 1 : 0};
  overflow: hidden;
  padding-bottom: 21px;

  .relative-tabs {
    box-shadow: 0 10px 21px -4px #d6d6d6;
  }
`

const FloatingTabsContainer = styled.div`
  position: fixed;
  background: white;
  width: 100%;
  padding-top: 10px;
  top: 35px;
  z-index: 100;
  box-shadow: 0 10px 21px -4px #d6d6d6;
`

@observer
class FloatingTabs extends Component {
  @observable isFloating = false
  container = null
  relativeTab = null

  componentDidMount() {
    this.container = document.getElementById(this.props.id)
    this.container.onscroll = this.onScroll
  }

  componentWillUnmount() {
    if (this.container) delete this.container.onscroll
  }
  
  onScroll = e => {
    if (!this.relativeTab) return

    let startingPoint = this.props.startingPoint 
      || this.relativeTab.offsetTop - this.relativeTab.offsetHeight
      
    this.isFloating = e.target.scrollTop > startingPoint
  }

  renderTabs() {
    return (
      <RelativeTabsContainer isFloating={this.isFloating} > 
        <div className="relative-tabs" ref={el => this.relativeTab = el} >
          {this.props.children}
        </div>
      </RelativeTabsContainer>
    )
  }

  renderFloatingTabs() {
    if (this.isFloating) return (
      <FloatingTabsContainer > 
        {this.props.children}
      </FloatingTabsContainer>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTabs()}
        {this.renderFloatingTabs()}
      </React.Fragment>
    )
  }
}

export default FloatingTabs