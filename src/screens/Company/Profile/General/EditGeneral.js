import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, observe } from 'mobx'
import TextField from '@material-ui/core/TextField'
// import { DatePicker } from '@material-ui/pickers'
import styled from 'styled-components'

// import MDIcon from '../../../../components/MDIcon'
import profileState from '../profileState'
import PhotoUploader from '../../../../components/PhotoUploader'
import FormRoute from '../../../../components/FormRoute'

const Container = styled.div`
  display: block;
  padding: 20px;

  .cv {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #c3c3c3;
    border-radius: 30px;
    margin: 10px 0;
    flex-direction: column;

    .icon {
      font-size: 70pt;
      color: #b3b3b3;
    }

    .label {
      color: #b3b3b3;
      font-size: 17pt;
    }
  }
`

@observer
class EditGeneral extends Component {
  @observable name = ''
  @observable description = ''
  @observable bannerFile = null
  @observable bannerUrl = ''
  @observable logoFile = null
  @observable logoUrl = ''

  async componentDidMount() {
    if (profileState.profile) this.updateLocaleProfile(profileState.profile)

    this.profileDisposer = observe(profileState, 'profile', profile => {
      this.updateLocaleProfile(profile.newValue)
    })
  }

  updateLocaleProfile(profile) {
    let {
      logoUrl, 
      bannerUrl, 
      description,
      name,
    } = profile

    this.name = name
    this.description = description
    this.bannerUrl = bannerUrl
    this.logoUrl = logoUrl
  }

  componentWillUnmount() {
    if (this.profileDisposer) this.profileDisposer()
  }

  renderInputs() {
    return (
      <React.Fragment>
        <PhotoUploader
          image={this.logoUrl}
          label="Upload Logo"
          onChange={file => {
            this.logoFile = file
            this.logoUrl = file ? URL.createObjectURL(file) : null
          }}
        />
        <PhotoUploader
          image={this.bannerUrl}
          label="Upload Banner"
          onChange={file => {
            this.bannerFile = file
            this.bannerUrl = file ? URL.createObjectURL(file) : null
          }}
        />
        <TextField
          name="name"
          type="text"
          label="Company Name"
          onChange={e => this.name = e.target.value}
          value={this.name}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="description"
          type="text"
          label="Description"
          onChange={e => this.description = e.target.value}
          value={this.description}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
      </React.Fragment>
    )
  }

  onSubmit = async () => {
    let {
      description,
      name,
      logoFile,
      bannerFile,
    } = this

    await profileState.updateGeneralProfile({
      description,
      name,
    }, logoFile, bannerFile)

    if (this.close) this.close()
  }

  render() {
    return (
      <FormRoute 
        onSubmit={this.onSubmit}
        isLoading={profileState.isUpdatingGeneralProfile}
        title="Edit Profile" 
        backPath="/company/profile"
        close={close => this.close = close} >
        <Container>
          {this.renderInputs()}
        </Container>
      </FormRoute>
    )
  }
}

export default EditGeneral