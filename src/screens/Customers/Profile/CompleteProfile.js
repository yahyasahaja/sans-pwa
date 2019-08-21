import React, { Component } from 'react'
import PopupRoute from '../../../components/PopupRoute'
import styled from 'styled-components'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { DatePicker } from '@material-ui/pickers'

const Container = styled.div`
  display: block;
  min-height: 100vh;

  @media only screen and (min-width: 600px) {
    max-width: 600px;
    margin: auto;
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .step-button {
      display: flex;
      justify-content: center;
      align-items: center;

      .back-button {
        margin: 0 10px;
      }
    }
  }
`

@observer
class CompleteProfile extends Component {
  @observable step = 0

  renderBasicProfileStep() {
    return (
      <Step >
        <StepLabel>Basic Profile</StepLabel>
        <StepContent>
          <TextField
            name="firstname"
            type="text"
            label="First Name"
            onChange={e => this.firstName = e.target.value}
            value={this.firstname}
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
          />
          <div className="actions" >
            <div className="skip-button" />
            <div className="step-button" >
              <div className="back-button" >
                <Button
                  disabled={this.step === 0}
                  onClick={() => this.step--}
                >
                  Back
                </Button>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.step++}
              >
                {this.step === 3 ? 'Finish' : 'Save'}
              </Button>
            </div>
          </div>
        </StepContent>
      </Step>
    )
  }

  renderCVStep() {
    return (
      <Step >
        <StepLabel>Curriculum Vitae</StepLabel>
        <StepContent>
          
        </StepContent>
      </Step>
    )
  }

  render() {
    return (
      <PopupRoute  > 
        <Container>
          <div className="content" >
            <div className="wrapper" >
              <Stepper activeStep={this.step} orientation="vertical">
                {this.renderBasicProfileStep()}
                {this.renderCVStep()}
              </Stepper>
            </div>
          </div>
        </Container>
      </PopupRoute>
    )
  }
}

export default CompleteProfile