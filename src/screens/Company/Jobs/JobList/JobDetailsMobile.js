import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { Route, Switch } from 'react-router-dom'
import Chip from '@material-ui/core/Chip'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import MDIcon from '../../../../components/MDIcon'

import PopupRoute from '../../../../components/PopupRoute'
import jobState from '../jobState'
import ApplicationsMobile from './ApplicationsMobile'
import UpdateJob from './UpdateJob'
import ViewExperiences from './ViewExperiences'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Cover = styled.div`
  display: block;
  height: 200px;

  span {
    height: 100%;
    display: block !important;

    img {
      height: 100%;
      object-position: center;
      object-fit: contain;
      width: 100%;
    }
  }
`

const StyledButton = styled(Button)`
  && {
    height: 35px;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .bottom-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    padding: 10px;
    box-shadow: 1px 10px 17px black;
    align-items: center;
    background: white;
  }

  .floating-tabs {
    position: fixed;
    background: white;
    width: 100%;
    padding-top: 10px;
    top: 35px;
    z-index: 100;
    box-shadow: 0 10px 21px -4px #d6d6d6;
  }

  .head {
    display: block;
    padding-bottom: 10px;
    background: #f9f9f9;

    .banner {
      width: 100%;
      height: 200px;
      background: url("${({job}) => job && job.banner}");
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      margin-bottom: 20px;
    }

    .wrapper {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;

      .left {
        display: block;
        
        .company-name {
          font-weight: bold;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .heart {
          display: block;
        }

        .date {
          font-size: 10pt;
        }
      }
    }
  }

  .content-wrapper {
    display: block;
    padding: 20px;
    padding-bottom: 100px;

    .job-details {
      width: 100%;
    }

    .description {
      display: block;
      padding: 10px;
    }
  }
`

const LoadingWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
`

const exampleData = {
  id: 0,
  title: 'Amazon FC IT Support Engineer',
  city: 'Sakai',
  created_at: new Date('18 June 2019'),
  favorited: false,
  salary: {
    amount: 3000000,
    currency: 'JPY',
    payment: 'yr'
  },
  description: 'Amazon software engineer recruitment, for Flutter Developer',
  banner: '/images/amazon-logo.jpg',
  company: {
    name: 'Amazon',
    description: 'A huge marketplace',
    logo: '/images/amazon-logo.jpg',
  }
}

@observer
class JobDetailsMobile extends Component {
  @observable isDeleteJobDialogOpened = false

  options = [
    {
      label: 'Update',
      icon: <MDIcon icon="pencil" />,
      onClick: () => {
        let { history, match } = this.props
        let jobId = match.params.job_id

        jobState.application = this.selectedApplication
        history.push(
          `/company/jobs/${jobId}/update`
        )
      }
    },
    {
      label: 'Delete',
      icon: <MDIcon icon="delete" />,
      onClick: () => {
        this.isOptionsOpened = false
        this.isDeleteJobDialogOpened = true
      }
    },
  ]

  componentDidMount() {
    let jobId = this.props.match.params.job_id
    jobState.fetchJob(jobId)
  }

  onScroll = e => {
    if (e.target.scrollTop > this.minFloatingTabsToBeShown) {
      this.shouldFloatingTabsShown = true
    } else {
      this.shouldFloatingTabsShown = false
    }
  }

  renderDetails() {
    if (this.isLoading) return <LoadingWrapper><CircularProgress /></LoadingWrapper>

    if (!jobState.job) return <div>Job Not Found!</div>

    return (
      <div className="head" >
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={jobState.job.bannerUrl} 
            effect="blur"
          />
        </Cover>
        <div className="wrapper" >
          <div className="left" >
            <div className="company-name" >{jobState.job.companyName}</div>
            <div>{jobState.job.companyName} - {jobState.job.location.state}, {jobState.job.location.country}</div>
          </div>

          <div className="right" >
            <div className="date" >{moment(jobState.job.createdAt).calendar()}</div>
          </div>
        </div>
      </div>
    )
  }

  renderJobContent() {
    if (jobState.isFetchingJob || !jobState.job) return <div></div>

    let salary = jobState.job.salary
    let skills = jobState.job.requiredSkills

    return (
      <div 
        className="content-wrapper"
      >
        <div className="job-details" >
          <h2>Description</h2>
          <div className="description" >{jobState.job.description}</div>
          {
            salary && (
              <React.Fragment>
                <h2>Salary</h2>
                <div>
                  {salary.amount} {salary.currency} / {salary.payment}
                </div>
              </React.Fragment>
            )
          }

          {
            skills && (
              <React.Fragment>
                <h2>Required Skills</h2>
                <div className="skills" >
                  {Object.keys(skills).map((s, i) => (
                    <Chip
                      key={i}
                      label={s}
                      color="primary"
                    />
                  ))}
                </div>
              </React.Fragment>
            )
          }
        </div>
      </div>
    )
  }

  renderBottomBar() {
    if (jobState.job) return (
      <div
        className="bottom-bar"
      >
        <StyledButton onClick={() => {
          this.props.history.push(
            `/company/jobs/${this.props.match.params.job_id}/applications`
          )
        }} variant="contained" color="primary" fullWidth >
          View Applications
        </StyledButton>
      </div>
    )
  }

  render() {
    let title = "Job Details"

    if (jobState.job && jobState.job.title) {
      title = jobState.job.title
    }

    return (
      <PopupRoute 
        title={title}
        backPath="/company/jobs"
        includeQueryString
        onScroll={this.onScroll}
        menuOptions={this.options}
        close={close => this.close = close}
      >
        <Container
          job={jobState.job}
        >
          {this.renderDetails()}
          {this.renderJobContent()}
          {this.renderBottomBar()}
          <Switch>
            <Route path="/company/jobs/:job_id/applications" component={ApplicationsMobile} />
          </Switch>

          <Switch>
            <Route path="/company/jobs/:job_id/update" component={UpdateJob} />
            <Route 
              path="/company/jobs/:job_id/applications/:app_id/experience" 
              component={ViewExperiences} 
            />
          </Switch>
          <Dialog
            open={this.isDeleteJobDialogOpened}
            TransitionComponent={Transition}
            onClose={() => {
              this.isDeleteJobDialogOpened = false
            }}
          >
            <div style={{minWidth: 300}} >
            <DialogTitle>Job Apply</DialogTitle>
            <DialogContent>
              {jobState.job && (
                <DialogContentText id="alert-dialog-slide-description">
                  Delete job for {jobState.job.title}?
                </DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={async () => {
                await jobState.deleteJob(jobState.job.id, true)
                this.close()
              }} color="secondary">
                Delete Job
              </Button>
              <Button onClick={async () => {
                this.isDeleteJobDialogOpened = false
              }} color="primary">
                Cancel
              </Button>
            </DialogActions>
            </div>
          </Dialog>
        </Container>
      </PopupRoute>
    )
  }
}

export default JobDetailsMobile
