import React, { Component } from 'react'
import styled from 'styled-components'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'
import ViewRoute from './ViewRoute'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'
import MDIcon from './MDIcon';
import { snackbar } from '../services/stores';

const LightTooltip = withStyles(theme => ({
  tooltip: {
    fontSize: 13,
  },
}))(Tooltip)

const Container = styled.div`
  display: block;
  position: absolute;
  ${({bottom}) => bottom ? 'bottom' : 'top'}: 5px;
  right: 5px;
  padding: 0 10px;
  color: white;
  background: #3498db;
  border-radius: 50px;
  font-size: 10pt;

  &:hover {
    background: #6fb0dc;
  }

  &:active {
    background: #295f84;
  }
`

const DialogContainer = styled.div`
  display: block;
  padding: 20px;

  .item {
    display: flex;
    width: 100%;
    border: 1px solid #bdc3c7;
    border-bottom: none;

    &:last-child {
      border: 1px solid #bdc3c7;
    }

    .label {
      background: #ecf0f1;
      width: 250px;
      display: flex;
      align-items: center;
    }

    .label, .value {
      padding: 0 10px;
    }

    .value {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`

@observer
class BlockchainWrapper extends Component {
  @observable isOpened = false

  renderDetails() {
    return this.props.data.map((d, i) => {
      let containerElement = null
      let inputElement = null
      function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i)
      }
      function createTextArea(text) {
        inputElement = document.createElement('textArea')
        inputElement.value = text
        containerElement.appendChild(inputElement)
      }
      function selectText() {
        var range,
          selection
    
        if (isOS()) {
          range = document.createRange()
          range.selectNodeContents(inputElement)
          selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
          inputElement.setSelectionRange(0, 999999)
        } else {
          // console.log('ke sini kan')
          // textArea.focus()
          inputElement.select()
        }
      }

      function copyToClipboard() {
        document.execCommand('copy')
        containerElement.removeChild(inputElement)
      }

      return (
        (
          <div className="item" key={i} ref={el => containerElement = el} >
            <div className="label" >{d.label}</div>
            <div className="value" >
              <span>{d.value}</span>
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={e => {
                  e.stopPropagation()
                  createTextArea(d.value)
                  selectText()
                  copyToClipboard()
                  snackbar.show(`${d.label} copied!`)
                }}
              >
                <MDIcon icon="content-copy" />
              </IconButton>
            </div>
          </div>
        )
      )
    })
  }

  render() {
    return (
      <React.Fragment>
        <LightTooltip
          PopperProps={{style: {fontSize: '12pt'}}}
          title="Blockchain Details">
          <Container bottom={this.props.bottom} onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            this.isOpened = !this.isOpened
          }} > 
            B
          </Container>
        </LightTooltip>
        {this.isOpened && (
          <div onClick={e => e.stopPropagation()} >
            <ViewRoute
              title={this.props.title}
              onClose={() => this.isOpened = !this.isOpened}
              withoutBack
            >
              <DialogContainer >
                <h2>{this.props.title}</h2>
                {this.renderDetails()}
              </DialogContainer>
            </ViewRoute>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default BlockchainWrapper