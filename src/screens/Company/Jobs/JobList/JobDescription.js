import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import moment from 'moment'
import posed from 'react-pose'
import Button from '@material-ui/core/Button'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Chip from '@material-ui/core/Chip'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import MDIcon from '../../../../components/MDIcon'
import jobState from '../jobState'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { fab } from '../../../../services/stores'
import JobDescriptionSkeleton from '../../../../components/JobDescriptionSkeleton';

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
    margin: 10px;
    margin-right: 0;
    margin-left: 20px;
  }
`

const Container = styled.div`
  display: block;

  .not-found {
    display: flex;
    justify-content: center;
    height: 100px;
    margin: 10px;
    border-radius: 10px;
    align-items: center;
    border: 2px dashed #adadad;
    font-size: 12pt;
    opacity: .7;
    margin-top: 20px;
  }

  .wrapper {
    display: block;
    padding: 0 20px;
    padding-bottom: 20px;
    background: #f7f7f7;
    border-bottom: 1px solid #e0e0e0;

    .up {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 10px 0;
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .date {
        font-size: 10pt;
      }
    }
  }

  .content {
    display: block;
    padding: 20px;

    .job-details {
      width: 100%;
    }

    .description {
      display: block;
      padding: 10px;
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
    y: 20,
    transition: { duration: 500 },
  },
})

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

const LoadingWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
`

@observer
class JobDescription extends Component {
  @observable containerPose = 'open'
  @observable isDeleteJobDialogOpened = false
  @observable optionsAnchor = null

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
    jobState.navigationStep = 0
    fab.isActive = true
  }

  renderDetails() {
    if (jobState.isFetchingJob) return <JobDescriptionSkeleton />

    if (!jobState.job) return <div className="not-found">Job not found</div>

    return (
      <React.Fragment >
        <div className="wrapper" >
          <div className="up" >
            <h3>{jobState.job.title}</h3>
            <div className="heart" >
              <StyledButton 
                onClick={() => {
                  this.props.history.push(
                    `/company/jobs/${this.props.match.params.job_id}/applications`
                  )
                }}
                disabled={jobState.job.candidateApplied}
                variant={jobState.job.candidateApplied ? 'outlined' : 'contained'} 
                color={jobState.job.candidateApplied ? 'default' : 'primary'}  >
                View Applications
              </StyledButton>
              <IconButton 
                onClick={async e => {
                  this.optionsAnchor = e.currentTarget
                  this.isOptionsOpened = true
                }}
                edge="end" 
                aria-label="Comments">
                <MDIcon icon="dots-vertical" />
              </IconButton>
            </div>
          </div>

          <div className="bottom" >
            <div>
              {jobState.job.companyName} - {jobState.job.location.state}, {jobState.job.location.country}
            </div>
            
            <div className="date" >{moment(jobState.job.createdAt).calendar()}</div>
          </div>
        </div>
        {this.renderJobContent()}
      </React.Fragment>
    )
  }

  renderJobContent() {
    if (jobState.isFetchingJob || !jobState.job) return <div></div>

    let salary = jobState.job.salary
    let skills = jobState.job.requiredSkills

    return (
      <div 
        className="content"
      >
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={jobState.job.bannerUrl} 
            effect="blur"
          />
        </Cover>
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

  render() {
    return (
      <PosedContainer
        pose={this.containerPose} 
        initialPose="close"
        className="custom-scroll"
      >
        {this.renderDetails()}
        <Menu
          elevation={1}
          anchorEl={this.optionsAnchor}
          open={Boolean(this.optionsAnchor)}
          onClose={() => this.optionsAnchor = null}
          PaperProps={{style:{ boxShadow: '1px 1px 10px #0000002b' }}}
        >
          {this.options.map((option, i) => (
            <ListItem onClick={option.onClick} button key={i}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </Menu>
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
      </PosedContainer>
    )
  }
}

export default JobDescription