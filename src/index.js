import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import Router from './App'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import { ParallaxProvider } from 'react-scroll-parallax'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

serviceWorker.register()

window.Clipboard = (function (window, document, navigator) {
  var textArea,
    copy

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  function createTextArea(text) {
    textArea = document.createElement('textArea')
    textArea.value = text
    document.body.appendChild(textArea)
  }

  function selectText() {
    var range,
      selection

    if (isOS()) {
      range = document.createRange()
      range.selectNodeContents(textArea)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textArea.setSelectionRange(0, 999999)
    } else {
      // console.log('ke sini kan')
      // textArea.focus()
      textArea.select()
    }
  }

  function copyToClipboard() {
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  copy = function (text) {
    createTextArea(text)
    selectText()
    copyToClipboard()
  }

  return {
    copy: copy
  }
})(window, document, navigator)

const MUITheme = createMuiTheme({
  palette: {
    primary: {
      main: '#3498db'
    },
    secondary: red,
  },
  typography: { 
    useNextVariants: true, 
  }
})

class App extends Component {
  render() { 
    return (
      <MuiThemeProvider theme={MUITheme}>
        <MuiPickersUtilsProvider utils={MomentUtils} >
          <ParallaxProvider>
            <Router />
          </ParallaxProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA