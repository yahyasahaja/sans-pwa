import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import profileState from '../profileState'
import FormRoute from '../../../../components/FormRoute'

const Container = styled.div`
  display: block;
  padding: 20px;

  .chip {
    margin: 0 5px;
  }
`

let education = {
  degree: "Bachelor",
  endYear: "2019",
  major: "Informatics Engineering",
  school: "Brawijaya University",
  startYear: "2015",
}

@observer
class EditEducation extends Component {
  @observable major = ''
  @observable school = ''
  @observable degree = ''
  @observable startYear = ''
  @observable endYear = ''

  async componentDidMount() {
    this.fetchExperience()
  }

  fetchExperience() {
    console.log(this.props.location.state)

    let { location: { state } } = this.props
    if (state && state.education) {
      this.updateLocaleProfile(state.education)
    } else {
      this.isFetchingExperience = true
    }

    try {
      this.updateLocaleProfile(education)

      this.isFetchingExperience = false
    } catch (err) {
      this.isFetchingExperience = false
      console.log('ERROR WHILE FETCHING EXPERIENCE', err)
    }
  }

  updateLocaleProfile(education) {
    let {
      major,
      school,
      degree,
      startYear,
      endYear,
    } = education

    this.major = major
    this.school = school
    this.degree = degree
    this.startYear = startYear
    this.endYear = endYear
  }

  renderInputs() {
    return (
      <React.Fragment>
        <TextField
          name="major"
          type="text"
          label="Major"
          onChange={e => this.major = e.target.value}
          value={this.major}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="school"
          type="text"
          label="School"
          onChange={e => this.school = e.target.value}
          value={this.school}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="degree"
          type="text"
          label="Degree"
          onChange={e => this.degree = e.target.value}
          value={this.degree}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="startyear"
          type="text"
          label="Start Year"
          onChange={e => this.startYear = e.target.value}
          value={this.startYear}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="startyear"
          type="text"
          label="End Year"
          onChange={e => this.endYear = e.target.value}
          value={this.endYear}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
      </React.Fragment>
    )
  }

  isSkillExist(skillName) {
    return this.skills.indexOf(skillName) !== -1
  }

  onSubmit = async () => {
    let {
      position,
      company,
      location,
      description,
      startAt,
      endDate,
      skills,
      bannerFile,
    } = this

    await profileState.updateEducations({
      position,
      company,
      location,
      description,
      startAt,
      endDate,
      skills: skills.map(d => ({skillName: d})),
    }, bannerFile)

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

export default EditEducation