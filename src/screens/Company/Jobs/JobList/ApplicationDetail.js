import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import AppSkeleton from './AppSkeleton'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

import MDIcon from '../../../../components/MDIcon'
import jobState from '../jobState'
import moment from 'moment'
import ExperiencesList from './ExperiencesList'
import EducationsList from './EducationsList'
import { fab } from '../../../../services/stores'

const LightTooltip = withStyles(theme => ({
  tooltip: {
    fontSize: 13,
  },
}))(Tooltip)

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const StyledExapansion = styled(ExpansionPanel)`
  && {
    display: block;
    overflow: hidden;

    .MuiExpansionPanelSummary-root {
      background: #34495e;
      color: white;

      &:hover {
        background: #445d77;
        transition: .3s;
      }

      &:active {
        background: #283848;
        transition: .1s;
      }

      .panel-head {
        font-weight: 500;
      }

      .MuiExpansionPanelSummary-expandIcon {
        color: white;
      }
    }
  }
`

const Container = styled.div`
  display: block;
  background: #f9f9f9;
  padding: 10px;

  .actions {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;

    button {
      margin: 0 10px;
    }
  }

  .normal-wrapper {
    width: 100%;

    .title {
      font-size: 10pt;
      font-weight: 500;
      margin: 5px 0;
      margin-top: 15px;
    }
  }

  .applications-wrapper {
    width: 100%;
    overflow: hidden;
    padding: 10px;
    background: white;
    position: relative;

    .cell-divider {
      margin-top: 20px;
    }

    .chip {
      margin: 0 5px;
    }

    .title {
      font-size: 10pt;
      font-weight: 500;
      margin: 5px 0;
      margin-top: 15px;
    }

    .up {
      display: flex;

      .left {
        display: block;
        .image {
          width: 120px;
          height: 120px;
          border: 5px solid white;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 1px 8px 11px 0px #00000038;
          background: white;

          span {
            height: 100%;
            display: block !important;

            img {
              height: 100%;
            }
          }
        }
      }

      .right {
        padding: 10px;
        padding-left: 30px;

        .job-name {

        }

        .company-name {

        }
      }
    }

    .middle {
      display: flex;
      justify-content: space-evenly;
      margin: 20px 0;
      border-top: 1px solid #ececec;
      border-bottom: 1px solid #ececec;

      .middle-wrapper {
        padding: 10px;

        .desc {
          margin-top: 10px;
          
          .status {
            font-weight: bold;
          }
        }
      }
    }

    .progress {

    }
  }
`

const defaultSteps = [
  'APPLIED',
  'IN_REVIEW',
  'APPROVED',
]

const STATUS_MAP = {
  APPLIED: 'APPLIED',
  IN_REVIEW: 'IN REVIEW',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
}

@observer
class ApplicationDetail extends Component {
  @observable listPose = 'open'
  @observable isDeclineAppDialogOpened = false
  @observable isAcceptAppDialogOpened = false
  @observable expanded = 0

  async componentDidMount() {
    jobState.navigationStep = 2
    fab.isActive = false

    await jobState.fetchApplications(this.props.match.params.job_id)
    await jobState.fetchApplication(this.props.match.params.app_id)

    if (jobState.application && jobState.application.currentStatus.status === 'APPLIED') {
      await jobState.updateProgress(jobState.application.id, 'IN_REVIEW')
    }
  }

  renderApplicationSkeleton() {
    return (
      <React.Fragment>
        <AppSkeleton /> 
        <AppSkeleton /> 
        <AppSkeleton /> 
      </React.Fragment>
    ) 
  }

  renderList() {
    console.log(jobState.application)
    return <div></div>
  }
  
  renderLists() {
    return (
      <List style={{padding: 0}}>
        {this.renderList()}
      </List>
    )
  }

  renderEducations() {
    let panelId = 2
    let d = jobState.application

    return (
      <StyledExapansion 
        expanded={this.expanded === panelId} 
        onChange={() => {
          if (this.expanded === panelId) {
            this.expanded = -1
          } else {
            this.expanded = panelId
          }
        }} >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className="panel-head">Educations</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="normal-wrapper" >
            <div className="title" >All Educations</div>
            {
              d.educations && <EducationsList experiences={d.educations} />
            }
          </div>
        </ExpansionPanelDetails>
      </StyledExapansion>
    )
  }

  renderExperiences() {
    let panelId = 1
    let d = jobState.application

    return (
      <StyledExapansion 
        expanded={this.expanded === panelId} 
        onChange={() => {
          if (this.expanded === panelId) {
            this.expanded = -1
          } else {
            this.expanded = panelId
          }
        }} >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className="panel-head">Experiences</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="normal-wrapper" >
            <div className="title" >All Experiences</div>
            {
              d.experiences && <ExperiencesList 
                experiences={d.experiences} 
                {...this.props}
              />
            }
          </div>
        </ExpansionPanelDetails>
      </StyledExapansion>
    )
  }

  renderBasicInfo() {
    let panelId = 0
    let d = jobState.application

    let {
      candidateFirstName = 'First Name',
      candidateLastName = 'Last Name',
      candidateDescription = 'Description',
      createdAt, 
      matchExperiences,
    } = d

    let status = d.currentStatus.status
    let statusColor = '#1abc9c'

    if (status === 'APPLIED') {
      statusColor = '#1abc9c'
    } else if (status === 'DENIED') {
      statusColor = '#e74c3c'
    } else if (status === 'IN_REVIEW') {
      statusColor = '#e67e22'
    } else {
      statusColor = '#3498db'
    }

    let activeStep = d.statusHistory.length - 1
    let steps = defaultSteps

    if (activeStep >= 2) {
      activeStep = 2

      steps = d.statusHistory.slice(0, 3)
    } else {
      steps = steps.map((step, i) => {
        if (i > activeStep) return { status: step }
        return {
          status: d.statusHistory[i].status,
          date: d.statusHistory[i].date
        }
      })
    }

    let name = `${candidateFirstName} ${candidateLastName}`

    return (
      <StyledExapansion 
        expanded={this.expanded === panelId} 
        onChange={() => {
          if (this.expanded === panelId) {
            this.expanded = -1
          } else {
            this.expanded = panelId
          }
        }} >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className="panel-head">Basic Info</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <div className="applications-wrapper" >
          <div className="up" >
            <div className="left" >
              <div className="image" >
                <LazyLoadImage
                  alt="cover"
                  placeholderSrc="/images/flat-pp.jpg"
                  src={d.bannerUrl} 
                />
              </div>
            </div>
            <div className="right" >
              <h2 className="job-name" >{name}</h2>
              <div className="company-name" >{candidateDescription}</div>
              <div className="company-name" >Applied on {
                moment(createdAt).format('DD MMMM YYYY')
              }</div>
            </div>
          </div>
          <div className="middle" >
            <div className="middle-wrapper" >
              <div className="title" >
                <MDIcon icon="calendar-multiple-check" /> Status
              </div>
              <div className="desc" >
                <div 
                  className="status" 
                  style={{color: statusColor}}
                >
                  {STATUS_MAP[status] || 'Location'}
                </div>
              </div>
            </div>
            <div className="middle-wrapper" >
              <div className="title" >
                <MDIcon icon="map-marker" /> Location
              </div>
              <div className="desc" >
                <div>{d.location || 'Location'}</div>
              </div>
            </div>
          </div>
          
          {
            d.matchSkills && (
              <React.Fragment>
                <div className="title" >Match Skills</div>
                <div className="skills" >
                  {Object.keys(d.matchSkills).map((s, i) => (
                    <Chip
                      className="chip"
                      key={i}
                      label={s}
                      color="primary"
                    />
                  ))}
                </div>
                <Divider className="cell-divider" />
              </React.Fragment>
            )
          }
          
          {
            d.matchExperiences && d.matchExperiences.length > 0 && (
              <React.Fragment>
                <div className="title" >Match Experiences</div>
                <ExperiencesList 
                  experiences={matchExperiences} 
                  {...this.props}
                />
              </React.Fragment>
            )
          }
          
          {
            d.skills && (
              <React.Fragment>
                <div className="title" >Another Skills</div>
                <div className="skills" >
                  {Object.keys(d.skills).map((s, i) => (
                    <Chip
                      className="chip"
                      key={i}
                      label={s}
                      color="primary"
                    />
                  ))}
                </div>
                <Divider className="cell-divider" />
              </React.Fragment>
            )
          }
          
          <div className="title" >Progress</div>
          <div className="progress" >
          <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((d, i) => {
                if (d.date) return (
                  <LightTooltip 
                    key={i}
                    style={{fontSize: '12pt'}} 
                    title={moment(d.date).calendar()}>
                    <Step >
                      <StepLabel>{STATUS_MAP[d.status]}</StepLabel>
                    </Step>
                  </LightTooltip>
                )

                return (
                  <Step key={i} >
                    <StepLabel>{STATUS_MAP[d.status]}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </div>
        </div>
        </ExpansionPanelDetails>
      </StyledExapansion>
    )
  }

  renderDetails() {
    if (jobState.isFetchingApplication) return this.renderApplicationSkeleton()
    
    if (!jobState.application) return <div>Application was Not Found</div>

    return (
      <React.Fragment>
        {this.renderBasicInfo()}
        {this.renderExperiences()}
        {this.renderEducations()}
      </React.Fragment>
    )
  }

  renderActions() {
    if (!jobState.application) return
    if (!jobState.application.currentStatus) return
    let status = jobState.application.currentStatus.status
    if (status === 'IN_REVIEW') return (
      <div className="actions" >
        <Button
          color="secondary"
          variant="contained"
          onClick={() => this.isDeclineAppDialogOpened = true}
        >
          Decline
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => this.isAcceptAppDialogOpened = true}
        >
          Accept
        </Button>
      </div>
    )
  }

  render() {
    let {
      candidateFirstName = 'First Name',
      candidateLastName = 'Last Name',
    } = jobState.application || {}

    let name = `${candidateFirstName} ${candidateLastName}`

    return (
      <Container >
        <div className="application-list custom-scroll" id="application-list" >
          {this.renderActions()}
          {this.renderDetails()}
        </div>

        <Dialog
          open={this.isDeclineAppDialogOpened}
          TransitionComponent={Transition}
          onClose={() => {
            this.isDeclineAppDialogOpened = false
          }}
        >
          <div style={{minWidth: 300}} >
          <DialogTitle>Decline Application</DialogTitle>
          <DialogContent>
            {jobState.application && (
              <DialogContentText id="alert-dialog-slide-description">
                Decline application for {name}?
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              if (jobState.application) {
                await jobState.updateProgress(jobState.application.id, 'DENIED', true)
              }
              this.isDeclineAppDialogOpened = false
            }} color="secondary">
              Decline
            </Button>
            <Button onClick={async () => {
              this.isDeclineAppDialogOpened = false
            }} color="primary">
              Cancel
            </Button>
          </DialogActions>
          </div>
        </Dialog>

        <Dialog
          open={this.isAcceptAppDialogOpened}
          TransitionComponent={Transition}
          onClose={() => {
            this.isAcceptAppDialogOpened = false
          }}
        >
          <div style={{minWidth: 300}} >
          <DialogTitle>Accept Application</DialogTitle>
          <DialogContent>
            {jobState.job && (
              <DialogContentText id="alert-dialog-slide-description">
                Accept {name} application?
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.isAcceptAppDialogOpened = false
            }} color="secondary">
              Cancel
            </Button>
            <Button onClick={async () => {
              if (jobState.application) {
                await jobState.updateProgress(jobState.application.id, 'APPROVED', true)
              }
              this.isAcceptAppDialogOpened = false
            }} color="primary">
              Accept
            </Button>
          </DialogActions>
          </div>
        </Dialog>
      </Container>
    )
  }
}

export default ApplicationDetail