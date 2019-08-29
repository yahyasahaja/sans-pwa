import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import axios from 'axios'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import posed from 'react-pose'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

import BaseRoute from '../../../components/BaseRoute'
import AppSkeleton from './AppSkeleton'
import MDIcon from '../../../components/MDIcon'
import moment from 'moment'
import { overlayLoading, snackbar } from '../../../services/stores'

const LightTooltip = withStyles(theme => ({
  tooltip: {
    fontSize: 13,
  },
}))(Tooltip)

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Container = styled.div`
  display: block;
  min-height: 100vh;
  width: 100%;
  background: #ecf0f1;

  @media only screen and (min-width: 800px) {
    padding: 30px;
  }
  
  @media only screen and (max-width: 800px) {
    padding-bottom: 50px;
  }

  .dashboard-base {
    width: 100%;
    min-height: 100vh;

    @media only screen and (min-width: 800px) {
      max-width: 700px;
      margin: auto;
    }
  }

  .no-app {
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    border-radius: 20px;
    border: 2px dashed #aeb1b2;
    flex-direction: column;

    .text {
      text-align: center;
      font-size: 15pt;
      font-weight: 300;
      color: #4c4f50;
      margin-bottom: 20px;
    }

    .icon {
      font-size: 62pt;
      color: #4c4f500f;
    }
  }

  .applications-wrapper {
    width: 100%;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    padding: 10px;
    background: white;
    margin: 10px 0;
    position: relative;
    
    .delete-button {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    @media only screen and (min-width: 800px) {
      border-radius: 10px;
      box-shadow: 1px 1px 10px #0000002b;
      border: 1px solid #e6e6e6;
      margin: 20px 0;
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

        .title {

        }

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

const PosedContainer = posed(Container)({
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 500 },
  },
  close: {
    opacity: 0,
    y: -20,
    transition: { duration: 500 },
  },
})

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
class Dashboard extends Component {
  @observable applications = []
  @observable fetchingApplications = false
  @observable selectedApplication = null
  @observable isDeleteDialogOpen = false
  @observable containerPose = 'open'

  componentDidMount() {
    this.fetchApplications()
  }

  fetchApplications = async () => {
    this.fetchingApplications = true

    try {
      let {
        data: {
          content
        }
      } = await axios.get('/user/applications')

      this.applications = content.filter(d => d.currentStatus)

      this.fetchingApplications = false
    } catch (err) {
      this.fetchingApplications = false
      console.log('ERROR WHILE FETCHING APPLICATIONS', err)
    }
  }

  renderApplications() {
    if (this.fetchingApplications) return (
      <React.Fragment>
        <div className="loading-wrapper" >
          <AppSkeleton />
        </div>
        <div className="loading-wrapper" >
          <AppSkeleton />
        </div>
        <div className="loading-wrapper" >
          <AppSkeleton />
        </div>
      </React.Fragment>
    )
    if (!this.applications || (this.applications && this.applications.length === 0)) return (
      <div className="no-app" >
        <div className="text" >No Application Found</div>
        <div>
          <Button color="primary" variant="contained" onClick={() => {
            this.props.history.push('/customers/jobs')
          }}>
            Search Job
          </Button>
        </div>
      </div>
    )

    return this.applications.map((d, i) => {
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

      let jobLocation = d.jobLocation
      if (jobLocation) jobLocation = `${jobLocation.state}, ${jobLocation.country}`

      return (
        <div 
          key={i}
          className="applications-wrapper" 
        >
          <IconButton 
            onClick={() => {
              this.selectedApplication = d
              this.isDeleteDialogOpen = true
            }}
            aria-label="delete" 
            className="delete-button" >
            <DeleteIcon />
          </IconButton>
          <div className="up" >
            <div className="left" >
              <div className="image" >
                <LazyLoadImage
                  alt="cover"
                  placeholderSrc="/images/flat-pp.jpg"
                  src={d.companyLogoUrl} 
                  effect="blur"
                />
              </div>
            </div>
            <div className="right" >
              <h2 className="job-name" >{d.jobTitle || 'Job Name'}</h2>
              <div className="company-name" >{d.companyName || 'Company Name'}</div>
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
                <div>{jobLocation || 'Location'}</div>
              </div>
            </div>
          </div>
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
      )
    })
  }

  async deleteApplciation() {
    try {
       overlayLoading.show()

       await axios.delete(`/user/application/${this.selectedApplication.jobId}`)
       snackbar.show('Application deleted')
       await this.fetchApplications()
    } catch (err) {
      console.log('ERROR WHILE DELETING APP', err.response)
    }

    overlayLoading.hide()
  }

  render() {
    return (
      <BaseRoute 
        webStyle={{backgroundColor: '#ecf0f1'}} 
        mobileStyle={{backgroundColor: '#ecf0f1', paddingTop: 45}} 
        noPadding >
        <PosedContainer
          pose={this.containerPose} 
          initialPose="close"
        >
          <div className="dashboard-base" >
            {this.renderApplications()}
          </div>
        </PosedContainer>

        <Dialog
          open={this.isDeleteDialogOpen}
          TransitionComponent={Transition}
          onClose={() => {
            this.isDeleteDialogOpen = false
          }}
        >
          <DialogTitle>Deletion Alert</DialogTitle>
          <DialogContent>
            {this.selectedApplication && (
              <DialogContentText id="alert-dialog-slide-description">
                {'Are you sure you want to delete '}
                {this.selectedApplication.jobName || 'Job Name'}?
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              await this.deleteApplciation()
              this.isDeleteDialogOpen = false
            }} color="secondary">
              Delete
            </Button>
            <Button onClick={() => {
              this.isDeleteDialogOpen = false
            }} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </BaseRoute>
    )
  }
}

export default Dashboard
