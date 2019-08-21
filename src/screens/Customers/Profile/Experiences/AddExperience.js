import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import TextField from '@material-ui/core/TextField'
import { DatePicker } from '@material-ui/pickers'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'

// import MDIcon from '../../../../components/MDIcon'
import profileState from '../profileState'
import PhotoUploader from '../../../../components/PhotoUploader'
import FormRoute from '../../../../components/FormRoute'

const Container = styled.div`
  display: block;
  padding: 20px;

  .chip {
    margin: 0 5px;
  }
`

let experience = {
  company: "company",
  description: "description",
  endDate: "2019-07-29T08:10:23.263+0000",
  location: "Osaka, Japan",
  position: "Software Developer",
  skills: [{skillName: "Java"}],
  startAt: "2019-07-29T08:10:23.261+0000",
}

const dummySkills = [
  'Java',
  'Javascript/NodeJS',
  'React JS',
  'Vue JS',
  'Angular',
  'Go',
  'Data Analysis',
  'PHP',
]

@observer
class AddExperience extends Component {
  @observable position = ''
  @observable company = ''
  @observable location = ''
  @observable description = ''
  @observable startAt = null
  @observable endDate = null
  @observable skills = []
  @observable isFetchingExperience = false
  @observable bannerFile = null
  @observable bannerUrl = ''

  async componentDidMount() {
    // this.fetchExperience()
  }

  fetchExperience() {
    // console.log(this.props.location.state)

    let { location: { state } } = this.props
    if (state && state.experience) {
      this.updateLocaleProfile(state.experience)
    } else {
      this.isFetchingExperience = true
    }

    try {
      this.updateLocaleProfile(experience)

      this.isFetchingExperience = false
    } catch (err) {
      this.isFetchingExperience = false
      console.log('ERROR WHILE FETCHING EXPERIENCE', err)
    }
  }

  updateLocaleProfile(experience) {
    let {
      position,
      company,
      location,
      description,
      startAt,
      endDate,
      skills,
      bannerUrl
    } = experience

    this.position = position
    this.company = company
    this.description = description
    this.location = location
    this.startAt = startAt
    this.endDate = endDate
    this.skills = skills.map(d => d.skillName)
    this.bannerUrl = bannerUrl
  }

  renderInputs() {
    return (
      <React.Fragment>
        <PhotoUploader
          image={this.bannerUrl}
          label="Upload Banner"
          onChange={file => {
            this.bannerFile = file
            this.bannerUrl = file ? URL.createObjectURL(file) : null
          }}
        />
        <TextField
          name="position"
          type="text"
          label="Position"
          onChange={e => this.position = e.target.value}
          value={this.position}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="company"
          type="text"
          label="Company"
          onChange={e => this.company = e.target.value}
          value={this.company}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="location"
          type="text"
          label="Location"
          onChange={e => this.location = e.target.value}
          value={this.location}
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
        <DatePicker
          margin="normal"
          label="Start Date"
          format={'MMM DD, YYYY'}
          value={this.startAt}
          variant="dialog"
          onChange={date => this.startAt = date}
          inputVariant="outlined"
          autoOk
          fullWidth
          required
        />
        <DatePicker
          margin="normal"
          label="End Date"
          format={'MMM DD, YYYY'}
          value={this.endDate}
          variant="dialog"
          onChange={date => this.endDate = date}
          inputVariant="outlined"
          autoOk
          fullWidth
          required
        />
        <FormControl style={{minWidth: 300}} >
          <InputLabel htmlFor="select-multiple-chip">Skills</InputLabel>
          <Select
            multiple
            fullWidth
            variant="outlined"
            value={toJS(this.skills)}
            onChange={e => {
              this.skills = e.target.value
              console.log(e.target.value)
            }}
            input={<Input variant="outlined" id="select-multiple-chip" />}
            renderValue={skills => (
              <div className="chips">
                {skills.map((skill, i) => (
                  <Chip 
                    color="primary" key={i} label={skill} className="chip" 
                  />
                ))}
              </div>
            )}
          >
            {dummySkills.map((skill, i) => {
              return (
              <MenuItem 
                selected={this.isSkillExist(skill)} 
                key={i} value={skill} >
                {skill}
              </MenuItem>
            )})}
          </Select>
        </FormControl>
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

    await profileState.createExperience({
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
        isLoading={profileState.isUpdatingExperience}
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

export default AddExperience