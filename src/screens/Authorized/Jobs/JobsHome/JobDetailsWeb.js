import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import moment from 'moment'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import posed from 'react-pose'
import SwipeableViews from 'react-swipeable-views'
import Button from '@material-ui/core/Button'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Chip from '@material-ui/core/Chip'

import MDIcon from '../../../../components/MDIcon'
import jobState from '../jobState'
import profileState from '../../Profile/profileState'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
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
    margin: 10px;
    margin-right: 0;
    margin-left: 20px;
  }
`

const Container = styled.div`
  display: flex;
  overflow: hidden;
  height: calc(100vh - 80px);
  flex-direction: column;

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

  .head {
    display: block;
    box-shadow: 0 10px 21px -4px #d6d6d6;

    .wrapper {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;

      .left {
        display: block;

        h3 {
          margin: 10px 0;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .heart {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .date {
          font-size: 10pt;
        }
      }
    }
  }

  .content {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .content-wrapper {
      display: block;
      padding-bottom: 100px;
      min-height: 100%;

      .up {
        padding: 20px;
        padding-top: 20px;
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

      .company-description {
        margin-top: 20px;
        padding: 20px
      }

      .job-details {
        width: 100%;
        padding: 20px;
      }

      .banner {
        width: 100%;
        height: 200px;
        background: url("${({job}) => job && job.banner}");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        margin: 10px 0;
      }

      .description {
        display: block;
        padding: 10px;
      }
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
class JobDetailsWeb extends Component {
  @observable job = null
  @observable selectedTab = 0
  @observable containerPose = 'open'
  @observable oldJob = null
  @observable isApplyJobDialogOpened = false

  componentDidMount() {
    this.fetchJob()
  }

  fetchJob = async () => {
    // let { job_id } = this.props.match.params
    if (this.props.job) this.job = this.oldJob = this.props.job
    this.job = await jobState.fetchJob(this.props.match.params.job_id, !this.props.job)
    await jobState.fetchCompany(this.job.companyId)
  }

  renderDetails() {
    if (jobState.isFetchingJob) return <JobDescriptionSkeleton />

    if (!this.job) return <div className="not-found">Job not found</div>

    profileState.favoriteJobs.slice()
    let isFavorited = profileState.checkFavoritedJob(this.job)

    return (
      <div className="head" >
        <div className="wrapper" >
        <div className="left" >
          <h3>{this.job.title}</h3>
          <p>
            {this.job.companyName} - {this.job.location.state}, {this.job.location.country}
          </p>
        </div>

        <div className="right" >
          <div className="heart" >
            <IconButton 
              onClick={async () => {
                profileState.toggleFavoriteJob(this.job)
              }}
              edge="end" 
              aria-label="Comments">
              <MDIcon 
                color={isFavorited ? 'red' : undefined}
                icon={`heart${isFavorited ? '' : '-outline'}`} 
              />
            </IconButton>
            <StyledButton 
              onClick={() => {
                this.isApplyJobDialogOpened = true
              }}
              disabled={this.job.candidateApplied}
              variant={this.job.candidateApplied ? 'outlined' : 'contained'} 
              color={this.job.candidateApplied ? 'default' : 'primary'}  >
              {this.job.candidateApplied ? 'You have applied this job' : 'Apply'}
            </StyledButton>
          </div>
          
          <div className="date" >{moment(this.job.createdAt).calendar()}</div>
        </div>
      </div>
      {this.renderTabs()}
      </div>
    )
  }

  renderContent() {
    return (
      <SwipeableViews
        className="content custom-scroll"
        axis="x"
        index={this.selectedTab}
        onChangeIndex={v => this.selectedTab = v}
      >
        {this.renderJobContent()}
        {this.renderCompanyContent()}
      </SwipeableViews>
    )
  }

  renderCompanyContent() {
    //TODO: change this loading screen
    if (jobState.isFetchingCompany) return <div></div>

    if (!jobState.company) return <div>not found</div>

    return (
      <div className="content-wrapper" >
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={jobState.company.bannerUrl} 
            effect="blur"
            className="company-banner"
          />
        </Cover>
        <div className="up" >
          <div className="left" >
            <div className="image" >
              <LazyLoadImage
                alt="cover"
                placeholderSrc="/images/flat-pp.jpg"
                src={jobState.company.logoUrl} 
              />
            </div>
          </div>
          <div className="right" >
            <h2 className="name" >{jobState.company.name || 'Company Name'}</h2>
            <div className="email" >{jobState.company.email || 'Company Email'}</div>
          </div>
        </div>

        <div className="company-description" >
          {jobState.company.description || 'Company Desc'}
        </div>
      </div>
    )
  }

  renderJobContent() {
    if (jobState.isFetchingJob || !this.job) return <div></div>

    let salary = this.job.salary
    let skills = this.job.requiredSkills

    return (
      <div 
        className="content-wrapper"
      >
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={this.job.bannerUrl} 
            effect="blur"
          />
        </Cover>
        <div className="job-details" >
          <h2>Description</h2>
          <div className="description" >{this.job.description}</div>
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

  renderTabs() {
    return (
      <Tabs 
        value={this.selectedTab} 
        indicatorColor="primary" 
        textColor="primary" 
        variant="fullWidth"
        onChange={(e, v) => this.selectedTab = v}>
        <Tab label="Job Description" />
        <Tab label="Company" />
      </Tabs>
    )
  }

  render() {
    return (
      <PosedContainer
        pose={this.containerPose} 
        initialPose="close"
        job={this.job}
      >
        {this.renderDetails()}
        {this.renderContent()}
        <Dialog
          open={this.isApplyJobDialogOpened}
          TransitionComponent={Transition}
          onClose={() => {
            this.isApplyJobDialogOpened = false
          }}
        >
          <div style={{minWidth: 300}} >
          <DialogTitle>Job Apply</DialogTitle>
          <DialogContent>
            {this.job && (
              <DialogContentText id="alert-dialog-slide-description">
                Apply job for {this.job.title}?
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.isApplyJobDialogOpened = false
            }} color="secondary">
              Cancel
            </Button>
            <Button onClick={async () => {
              await jobState.applyJob(this.job.id, true)
              this.isApplyJobDialogOpened = false
            }} color="primary">
              Apply Job
            </Button>
          </DialogActions>
          </div>
        </Dialog>
      </PosedContainer>
    )
  }
}

export default JobDetailsWeb