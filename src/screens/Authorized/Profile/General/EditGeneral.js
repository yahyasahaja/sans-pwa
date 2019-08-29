import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, observe } from 'mobx'
import TextField from '@material-ui/core/TextField'
import { DatePicker } from '@material-ui/pickers'
import styled from 'styled-components'
import moment from 'moment'

import MDIcon from '../../../../components/MDIcon'
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
  @observable isLoading = false
  @observable firstName = ''
  @observable lastName = ''
  @observable description = ''
  @observable country = ''
  @observable address = ''
  @observable industry = ''
  @observable birthDate = null
  @observable cv = ''
  @observable bannerFile = null
  @observable bannerUrl = ''
  @observable profilePictureFile = null
  @observable profilePictureUrl = ''

  async componentDidMount() {
    if (profileState.profile) this.updateLocaleProfile(profileState.profile)

    this.profileDisposer = observe(profileState, 'profile', profile => {
      this.updateLocaleProfile(profile.newValue)
    })
  }

  updateLocaleProfile(profile) {
    let {
      firstName,
      lastName,
      description,
      country,
      address,
      industry,
      birthDate,
      profilePictureUrl,
      bannerUrl,
    } = profile

    this.firstName = firstName
    this.lastName = lastName
    this.description = description
    this.country = country
    this.address = address
    this.industry = industry
    this.birthDate = moment(birthDate)
    this.bannerUrl = bannerUrl
    this.profilePictureUrl = profilePictureUrl
  }

  componentWillUnmount() {
    if (this.profileDisposer) this.profileDisposer()
  }

  renderInputs() {
    return (
      <React.Fragment>
        <PhotoUploader
          image={this.profilePictureUrl}
          label="Profile Picture"
          onChange={file => {
            this.profilePictureFile = file
            this.profilePictureUrl = file ? URL.createObjectURL(file) : null
          }}
        />
        <PhotoUploader
          image={this.bannerUrl}
          label="Banner"
          onChange={file => {
            this.bannerFile = file
            this.bannerUrl = file ? URL.createObjectURL(file) : null
          }}
        />
        <TextField
          name="firstname"
          type="text"
          label="First Name"
          onChange={e => this.firstName = e.target.value}
          value={this.firstName}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="lastname"
          type="text"
          label="Last Name"
          onChange={e => this.lastName = e.target.value}
          value={this.lastName}
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
        <TextField
          name="country"
          type="text"
          label="Country"
          onChange={e => this.country = e.target.value}
          value={this.country}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="address"
          type="text"
          label="Address"
          onChange={e => this.address = e.target.value}
          value={this.address}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="industry"
          type="text"
          label="Industry"
          onChange={e => this.industry = e.target.value}
          value={this.industry}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <DatePicker
          margin="normal"
          id="mui-pickers-date"
          label="Birth Date"
          format={'MMM DD, YYYY'}
          value={this.birthDate}
          variant="dialog"
          onChange={date => this.birthDate = date}
          inputVariant="outlined"
          autoOk
          fullWidth
          required
        />
        <label className="cv" htmlFor="cv">
          <MDIcon className="icon" icon="file-document-outline" />
          <div className="label" >Upload CV</div>
          <div className="file" >{this.cv && this.cv.name}</div>
        </label>
        <input id="cv" hidden type="file" onChange={e => this.cv = e.target.files[0]} />
      </React.Fragment>
    )
  }

  onSubmit = async () => {
    let {
      firstName,
      lastName,
      description,
      country,
      address,
      industry,
      birthDate,
      cv,
      profilePictureFile,
      bannerFile,
    } = this

    console.log(typeof birthDate)

    await profileState.updateGeneralProfile({
      firstName,
      lastName,
      description,
      country,
      address,
      industry,
      birthDate: birthDate ? birthDate.toDate().getTime() : null,
    }, cv, profilePictureFile, bannerFile)

    if (this.close) this.close()
  }

  render() {
    return (
      <FormRoute 
        onSubmit={this.onSubmit}
        isLoading={profileState.isUpdatingGeneralProfile}
        title="Edit Profile" 
        backPath="/customers/profile"
        close={close => this.close = close} >
        <Container>
          {this.renderInputs()}
        </Container>
      </FormRoute>
    )
  }
}

export default EditGeneral