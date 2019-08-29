import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import axios from 'axios'

import FormRoute from '../../../components/FormRoute'
import { user, responsive, snackbar } from '../../../services/stores'

const Container = styled.div`
  display: block;
  padding: 20px;

  .password-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    .password {
      width: 100%;
    }
  }

  .chip {
    margin: 0 5px;
  }
`

@observer
class Account extends Component {
  @observable currentPassword = ''
  @observable email = ''
  @observable newPassword = ''
  @observable retypePassword = ''
  @observable shouldShowPassword = false
  @observable shouldShowPassword2 = false
  @observable shouldShowPassword3 = false
  @observable isUpdatingAccount = false

  async componentDidMount() {
    this.email = user.data.email
  }

  renderPasswords() {
    return (
      <React.Fragment>
        <div className="password-wrapper" >
          <TextField
            name="password"
            type={this.shouldShowPassword ? 'text' : 'password'}
            label="Current Password"
            className="password"
            onChange={e => this.currentPassword = e.target.value}
            value={this.currentPassword}
            required
            fullWidth
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => this.shouldShowPassword = !this.shouldShowPassword}
                  >
                    {this.shouldShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="password-wrapper" >
          <TextField
            name="new-password"
            type={this.shouldShowPassword2 ? 'text' : 'password'}
            label="New Password"
            className="password"
            onChange={e => this.newPassword = e.target.value}
            value={this.newPassword}
            required
            fullWidth
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => this.shouldShowPassword2 = !this.shouldShowPassword2}
                  >
                    {this.shouldShowPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="password-wrapper" >
          <TextField
            name="password"
            type={this.shouldShowPassword3 ? 'text' : 'password'}
            label="Retype Password"
            className="password"
            onChange={e => this.retypePassword = e.target.value}
            value={this.retypePassword}
            required
            fullWidth
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => this.shouldShowPassword3 = !this.shouldShowPassword3}
                  >
                    {this.shouldShowPassword3 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </React.Fragment>
    )
  }

  renderInputs() {
    let label = 'Email'
    let isLocal = user.data.provider === 'local'

    if (!isLocal) label = 'Google Email'

    return (
      <React.Fragment>
        <TextField
          name="email"
          type="email"
          label={label}
          onChange={e => this.email = e.target.value}
          value={this.email}
          fullWidth
          required
          margin="normal"
          variant="outlined"
          disabled
        />
        {isLocal && this.renderPasswords()}
      </React.Fragment>
    )
  }

  onSubmit = async () => {
    let {
      currentPassword: oldPassword,
      newPassword,
      retypePassword: confirmNewPassword,
    } = this

    this.isUpdatingAccount = true

    await axios.put('/auth/password', {
      oldPassword,
      newPassword,
      confirmNewPassword,
    })

    this.isUpdatingAccount = false
    snackbar.show('Password changed')

    if (this.close) this.close()
  }

  render() {
    return (
      <FormRoute 
        onSubmit={this.onSubmit}
        isLoading={this.isUpdatingAccount}
        wrapperProps={{style: {
          margin: 'auto',
          maxWidth: '500px',
          padding: '30px',
          background: 'white',
          marginTop: '20px',
          border: '1px solid #c4c4c4',
          borderRadius: '10px',
          height: 'auto'
        }}}
        formProps={{style: {
          background: '#f7f7f7',
          minHeight: '100vh'
        }}}
        rebaseDialog={true}
        title="Edit Profile" 
        backPath={
          responsive.isMobile ? '/company/menu'
          : '/company/profile'
        }
        close={close => this.close = close} >
        <Container>
          {this.renderInputs()}
        </Container>
      </FormRoute>
    )
  }
}

export default Account