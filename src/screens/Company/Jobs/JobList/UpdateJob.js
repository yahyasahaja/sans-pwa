import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'

// import MDIcon from '../../../../components/MDIcon'
import PhotoUploader from '../../../../components/PhotoUploader'
import FormRoute from '../../../../components/FormRoute'
import jobState from '../jobState'
import ChipSelect from '../../../../components/ChipSelect'
import profileState from '../../Profile/profileState';

const Container = styled.div`
  display: block;
  padding: 20px;

  .chip {
    margin: 0 5px;
  }
`

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
class UpdateJob extends Component {
  @observable companyName = ''
  @observable title = ''
  @observable description = ''
  @observable location = {
    country: '',
    state: '',
  }
  @observable salary = {
    amount: 0,
    currency: '',
    payment: ''
  }
  @observable skills = []
  @observable bannerUrl = ''
  @observable bannerFile = null

  async componentDidMount() {
    if (jobState.job && this.props.match.params.job_id) {
      this.updateLocaleData(jobState.job)
    } else {
      if (!profileState.profile) {
        await profileState.fetchProfile()
        if (profileState.profile) this.companyName = profileState.profile.name
      }
    }
    //TODO: update when job is fetched using observe
  }

  updateLocaleData(job) {
    let {
      bannerUrl,
      companyName,
      title,
      description,
      location = {
        country: '',
        state: '',
      },
      salary = {
        amount: 0,
        currency: '',
        payment: ''
      },
      requiredSkills,
    } = job

    this.bannerUrl = bannerUrl
    this.companyName = companyName
    this.title = title
    this.description = description
    this.location = location
    this.salary = salary
    if (requiredSkills) this.skills = Object.keys(requiredSkills)
  }

  renderInputs() {
    return (
      <React.Fragment>
        <h2>Basic Info</h2>
        <PhotoUploader
          image={this.bannerUrl}
          label="Upload Banner"
          onChange={file => {
            this.bannerFile = file
            this.bannerUrl = file ? URL.createObjectURL(file) : null
          }}
        />
        <TextField
          name="title"
          type="text"
          label="Title"
          onChange={e => this.title = e.target.value}
          value={this.title}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="companyname"
          type="text"
          label="Company Name"
          onChange={e => this.companyName = e.target.value}
          value={this.companyName}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="description"
          type="text"
          label="Description"
          multiline
          rows={3}
          onChange={e => this.description = e.target.value}
          value={this.description}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <h2>Location</h2>
        <TextField
          name="country"
          type="text"
          label="Country"
          onChange={e => this.location.country = e.target.value}
          value={this.location.country}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="state"
          type="text"
          label="state"
          onChange={e => this.location.state = e.target.value}
          value={this.location.state}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <h2>Salary</h2>
        <TextField
          name="amount"
          type="text"
          label="Amount"
          onChange={e => this.salary.amount = e.target.value}
          value={this.salary.amount}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="currency"
          type="text"
          label="Currency"
          onChange={e => this.salary.currency = e.target.value}
          value={(this.salary.currency || '').toUpperCase()}
          placeholder="JP"
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          select
          label="Payment"
          value={this.salary.payment}
          onChange={e => this.salary.payment = e.target.value}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          {[
            {
              label: 'Month',
              value: 'mo',
            },
            {
              label: 'Year',
              value: 'yr',
            }
          ].map((d, i) => <MenuItem value={d.value} key={i}>{d.label}</MenuItem>)}
        </TextField>
        <ChipSelect 
          hint="Select your skills"
          list={this.skills}
          textFieldProps={{fullWidth: true}}
          options={dummySkills}  
          onChange={skills => this.skills = skills}
        />
      </React.Fragment>
    )
  }

  isSkillExist(skillName) {
    return this.skills.indexOf(skillName) !== -1
  }

  onSubmit = async () => {
    let {
      bannerFile,
      companyName,
      title,
      description,
      location,
      salary,
      skills,
    } = this

    await jobState.updateJob({
      companyName,
      title,
      description,
      location,
      salary,
      skills: skills.map(d => ({skillName: d})),
    }, this.props.match.params.job_id, bannerFile)

    if (this.close) this.close()
  }

  render() {
    let jobId = this.props.match.params.job_id
    let backPath
    if (jobId) backPath = `/company/jobs/${jobId}`
    
    return (
      <FormRoute 
        onSubmit={this.onSubmit}
        isLoading={jobState.isUpdatingJob}
        title={`${jobState.job ? 'Update ' + jobState.job.title : 'New Job'}`} 
        backPath={backPath}
        close={close => this.close = close} >
        <Container>
          {this.renderInputs()}
        </Container>
      </FormRoute>
    )
  }
}

export default UpdateJob