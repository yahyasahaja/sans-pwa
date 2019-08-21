import React, { Component } from 'react'
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'

const Container = styled.div`
  display: block;
`

@observer
class ChipSelect extends Component {
  @observable options = []
  @observable list = []
  @observable text = ''

  componentDidMount() {
    window.toJS = toJS
    if (this.props.options) this.options = toJS(this.props.options)
    if (this.props.list) this.list = toJS(this.props.list)
  }

  render() {
    let { label, onChange, textFieldProps, hint } = this.props
    let { options } = this

    return (
      <Container>
        <TextField
          {...textFieldProps}
          select
          label={label}
          value={''}
          onChange={e => {
            let value = e.target.value
            this.options.splice(this.options.indexOf(value), 1)
            this.list.push(value)
            if (onChange) onChange(this.list)
          }}
          helperText={hint}
          margin="normal"
          variant="outlined"
        >
          {options.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <div className="chips" >
          {this.list.map((d, i) => {
            return (
            <Chip
              key={i}
              label={d}
              onDelete={() => {
                this.list.splice(i, 1)
                this.options.push(d)
                if (onChange) onChange(this.list)
              }}
              style={{margin: '5px'}}
              color="primary"
            />
            )
          })}
        </div>
      </Container>
    )
  }
}

export default ChipSelect