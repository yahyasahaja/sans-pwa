import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, computed, toJS } from 'mobx'
import TextField from '@material-ui/core/TextField'
import { DatePicker } from '@material-ui/pickers'
import styled from 'styled-components'
// import MenuItem from '@material-ui/core/MenuItem'
// import FormControl from '@material-ui/core/FormControl'
// import Select from '@material-ui/core/Select'
// import Chip from '@material-ui/core/Chip'
// import InputLabel from '@material-ui/core/InputLabel'
// import Input from '@material-ui/core/Input'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ChipSelect from '../../../../components/ChipSelect'
import Switch from '@material-ui/core/Switch'
import moment from 'moment'

// import MDIcon from '../../../../components/MDIcon'
import profileState from '../profileState'
// import PhotoUploader from '../../../../components/PhotoUploader'
import FormRoute from '../../../../components/FormRoute'

const Container = styled.div`
  display: block;
  padding: 20px;

  .contact {
    display: flex;
    align-items: center;
    max-width: 400px;

    .contact-domain {
      display: flex;
      margin-left: 15px;
      font-size: 12pt;
      margin-top: 5px;
      font-weight: 500;
    }
  }

  .chip {
    margin: 0 5px;
  }

  .input-label {
    color: #7c7c7c;
    font-size: 9pt;
    margin-left: 3px;
  }

  .company-wrapper {
    border-top: 1px dashed #c4c4c4;
    border-bottom: 1px dashed #c4c4c4;
    padding: 10px 0;
    margin: 20px 0;
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

const OptionContainer = styled.div`
  display: flex;
  align-items: center;

  .label {
    margin-left: 10px;
  }
`

const Option = props => {
  const {data} = props;
  return (
    <components.Option {...props}>
      <OptionContainer>
        <Avatar className="avatar" src={data.logoUrl} />
        <div className="label" >{data.label}</div>
      </OptionContainer>
    </components.Option>
  );
}

@observer
class UpdateExperience extends Component {
  @observable position = ''
  @observable company = ''
  @observable location = ''
  @observable description = ''
  @observable startDate = null
  @observable endDate = null
  @observable skills = []
  @observable isFetchingExperience = false
  @observable bannerFile = null
  @observable bannerUrl = ''
  @observable shouldAddCompany = false
  @observable companyIdentifier = ''
  @observable companyWebAddress = ''
  @observable contact = ''
  @observable defaultOptions = []

  async componentDidMount() {
    if (this.props.match.params.id) this.fetchExperience()
  }

  fetchExperience() {
    // console.log(this.props.location.state)

    let { location: { state } } = this.props
    if (state && state.experience) {
      this.updateLocaleProfile(state.experience)
      return
    } else {
      this.isFetchingExperience = true
    }

    try {
      profileState.fetchExperience(this.props.match.praams.id)

      this.isFetchingExperience = false
    } catch (err) {
      this.isFetchingExperience = false
      console.log('ERROR WHILE FETCHING EXPERIENCE', err)
    }
  }

  async updateLocaleProfile(experience) {
    console.log(experience)
    let {
      position,
      company,
      location,
      description,
      startDate,
      endDate,
      skills,
      bannerUrl,
      isCompanyAlreadyRegistered,
      companyIdentifier,
      companyWebAddress,
    } = experience

    this.position = position
    this.company = company
    this.description = description
    this.location = location
    this.startDate = moment(startDate)
    this.endDate = moment(endDate)
    this.skills = skills.map(d => d.skillName)
    this.bannerUrl = bannerUrl
    this.shouldAddCompany = !isCompanyAlreadyRegistered
    this.companyIdentifier = companyIdentifier || ''
    this.companyWebAddress = companyWebAddress || ''

    if (this.companyIdentifier) {
      let company = await profileState.fetchCompany(this.companyIdentifier)

      console.log(company)
      if (company) this.defaultOptions.push({
        ...company,
        label: company.name, value: company.id
      })
    }
  }

  renderCompanySelection() {
    return (
      <React.Fragment>
        <div className="input-label" >Select company</div>
        <AsyncSelect 
          components={{
            Option
          }}
          styles={{
            menu: (base, state) => ({
              ...base,
              opacity: state.isDisabled ? ".5" : "1",
              backgroundColor: "white",
              zIndex: "999"
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#bddef5" : base.backgroundColor,
              color: state.isSelected ? "black" : base.color,
            })
          }}
          defaultOptions={toJS(this.defaultOptions)}
          onChange={company => {
            this.company = company.label
            this.companyIdentifier = company.id
            this.companyWebAddress = company.webAddress
          }}
          loadOptions={inputValue =>
          new Promise((resolve, reject) => {
            if (this.debounceTimeoutId) clearTimeout(this.debounceTimeoutId)
            this.debounceTimeoutId = setTimeout(() => {
              axios.get(`/companies/find?search=${inputValue}&size=1000`).then(res => {
                resolve(
                  res.data.content
                    .filter(d => d.name)
                    .map(d => ({label: d.name, value: d.id, ...d}))
                )
              }).catch(err => reject(err))
            }, 500)
          })}
        />
        {this.renderContact()}
      </React.Fragment>
    )
  }
  
  debounceTimeoutId = null

  renderAddCompany() {
    return (
      <React.Fragment>
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
          name="companyWebAddress"
          type="text"
          label="Company Web Address"
          onChange={e => this.companyWebAddress = e.target.value}
          value={this.companyWebAddress}
          placeholder="example.com"
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        {this.renderContact()}
      </React.Fragment>
    )
  }

  renderContact() {
    if (this.companyWebAddress) {
      return (
        <div className="contact" >
          <TextField
            name="contact"
            type="text"
            label="Contact"
            hint="Company contact so send confirmation"
            onChange={e => this.contact = e.target.value}
            value={this.contact}
            placeholder="contact.email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <div className="contact-domain" >
            {this.domain}
          </div>
        </div>
      )
    }
  }

  @computed
  get emailToSendVerificationRequest() {
    return `${this.contact}${this.domain}`
  }

  @computed
  get domain() {
    return `@${this.validateWebAddress(this.companyWebAddress)}`
  }

  validateWebAddress(webAddress) {
    return webAddress.replace(/^(http[s]?:\/\/www\\.|http[s]?:\/\/|www\\.)/, "")
  }

  renderInputs() {
    return (
      <React.Fragment>
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
        <div className="company-wrapper" >
          <FormControlLabel
            control={
              <Switch
                checked={this.shouldAddCompany}
                onChange={() => this.shouldAddCompany = !this.shouldAddCompany}
                value="registered"
                color="primary"
              />
            }
            label="Add New Company"
          />
          {
            !this.shouldAddCompany 
              ? this.renderCompanySelection()
              : this.renderAddCompany()
          }
        </div>
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
          rows={3}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <DatePicker
          margin="normal"
          label="Start Date"
          format={'MMM DD, YYYY'}
          value={this.startDate}
          variant="dialog"
          onChange={date => this.startDate = date}
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
        <ChipSelect 
          hint="Select your skills"
          list={this.skills}
          textFieldProps={{fullWidth: true}}
          options={dummySkills} 
          onChange={async skills => {
            this.skills = skills
          }} 
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
      startDate,
      endDate,
      skills,
      shouldAddCompany,
      companyIdentifier,
      companyWebAddress,
    } = this

    let success = await profileState.updateExperience({
      position,
      company,
      location,
      description,
      startDate: startDate ? startDate.toDate().getTime() : null,
      endDate: endDate ? endDate.toDate().getTime() : null,
      skills: skills.map(d => ({skillName: d})),
      isCompanyAlreadyRegistered: !shouldAddCompany,
      companyIdentifier,
      emailToSendVerificationRequest: this.emailToSendVerificationRequest,
      companyWebAddress: this.validateWebAddress(companyWebAddress),
    }, this.props.match.params.id)

    if (this.close && success) this.close()
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

export default UpdateExperience