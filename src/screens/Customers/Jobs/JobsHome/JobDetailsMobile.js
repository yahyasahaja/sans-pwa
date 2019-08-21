import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import moment from 'moment'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SwipeableViews from 'react-swipeable-views'
import Button from '@material-ui/core/Button'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Chip from '@material-ui/core/Chip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import MDIcon from '../../../../components/MDIcon'
import PopupRoute from '../../../../components/PopupRoute'
import profileState from '../../Profile/profileState'
import jobState from '../jobState'
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
  }
`

const Container = styled.div`
  display: flex;
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

  .bottom-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    /* padding: 10px; */
    box-shadow: 1px 10px 17px black;
    align-items: center;
    background: white;

    .heart {
      display: block;
      
      button {
        margin-right: 0 !important;
        
        .mdi {
          font-size: 2rem !important;
        }
      }
    }
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
    box-shadow: 0 10px 21px -4px #d6d6d6;

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
      margin-top: 20px;

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

  .content {
    height: 100%;

    .content-wrapper {
      display: block;
      padding-bottom: 100px;
      min-height: 100%;

      .up {
        margin: 20px;
        padding-top: 20px;
        display: flex;
        border-top: 1px dashed #bdbdbd;
        margin-top: 20px;

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

      .company-description {
        padding: 20px;
      }

      .description {
        display: block;
        padding: 20px;
        margin-top: 20px;
      }
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
  @observable isFetchingJob = false
  @observable job = null
  @observable selectedTab = 0
  @observable shouldFloatingTabsShown = false
  @observable isApplyJobDialogOpened = false
  
  minFloatingTabsToBeShown = 500

  componentDidMount() {
    this.fetchJob()
  }

  fetchJob = async () => {
    // let { job_id } = this.props.match.params
    if (this.props.job) this.job = this.oldJob = this.props.job
    this.job = await jobState.fetchJob(this.props.match.params.job_id, !this.props.job)
    await jobState.fetchCompany(this.job.companyId)
  }

  onScroll = e => {
    if (e.target.scrollTop > this.minFloatingTabsToBeShown) {
      this.shouldFloatingTabsShown = true
    } else {
      this.shouldFloatingTabsShown = false
    }
  }

  renderDetails() {
    if (jobState.isFetchingJob) return <JobDescriptionSkeleton />

    if (!this.job) return <div className="not-found" >Job not found</div>
    
    return (
      <div className="head" >
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={this.job.bannerUrl} 
            effect="blur"
          />
        </Cover>
        <div className="wrapper" >
          <div className="left" >
            <div className="company-name" >{this.job.companyName}</div>
            <div>{this.job.location.state}, {this.job.location.country}</div>
          </div>

          <div className="right" >
            <div className="date" >{moment(this.job.createdAt).calendar()}</div>
          </div>
        </div>
        {
          <div ref={el => {
            if (el) {
              this.tabs = el
              this.minFloatingTabsToBeShown = el.offsetTop - el.offsetHeight
            }
          }}>{this.renderTabs()}</div>
        }
      </div>
    )
  }

  renderContent() {
    return (
      <SwipeableViews
        enableMouseEvents
        animateHeight
        className="content"
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
    if (jobState.isFetchingCompany) return <div>Fetching Company..</div>

    if (!jobState.company) return <div>Company not found</div>

    return (
      <div className="content-wrapper" >
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={jobState.company.bannerUrl} 
            effect="blur"
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

        <div className="company-description" >{jobState.company.description || 'Company Desc'}</div>
      </div>
    )
  }

  renderJobContent() {
    if (this.isLoading || !this.job) return <div></div>

    let salary = this.job.salary
    let skills = this.job.requiredSkills

    return (
      <div 
        className="content-wrapper"
      >
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
    let style = {}

    if (this.shouldFloatingTabsShown) style.opacity = 0

    return (
      <Tabs 
        value={this.selectedTab} 
        indicatorColor="primary" 
        textColor="primary" 
        variant="fullWidth"
        style={style}
        onChange={(e, v) => this.selectedTab = v}>
        <Tab label="Jobs" />
        <Tab label="Company" />
      </Tabs>
    )
  }

  renderFloatingTabs() {
    return (
      <div className="floating-tabs" >
        <Tabs 
          value={this.selectedTab} 
          indicatorColor="primary" 
          textColor="primary" 
          variant="fullWidth"
          onChange={(e, v) => this.selectedTab = v}>
          <Tab label="Jobs" />
          <Tab label="Company" />
        </Tabs>
      </div>
    )
  }

  renderBottomBar() {
    if (!this.job) return

    profileState.favoriteJobs.slice()
    let isFavorited = profileState.checkFavoritedJob(this.job)
    
    return (
      <div
        className="bottom-bar"
      >
        <StyledButton 
          onClick={() => {
            this.isApplyJobDialogOpened = true
          }} 
          disabled={this.job.candidateApplied}
          variant={this.job.candidateApplied ? 'outlined' : 'contained'} 
          color={this.job.candidateApplied ? 'default' : 'primary'}
          fullWidth 
        >
          {this.job.candidateApplied ? 'You have applied this job' : 'Apply'}
        </StyledButton>
        <div className="heart" >
          <IconButton 
            onClick={() => profileState.toggleFavoriteJob(this.job)}
            edge="end" 
            aria-label="Comments">
            <MDIcon 
              color={isFavorited ? 'red' : undefined}
              icon={`heart${isFavorited ? '' : '-outline'}`} 
            />
          </IconButton>
        </div>
      </div>
    )
  }

  render() {
    let title = "Job Details"

    if (this.job && this.job.title) {
      title = this.job.title
    }

    return (
      <PopupRoute 
        title={title}
        backPath="/customers/jobs/home"
        includeQueryString
        onScroll={this.onScroll}
      >
        <Container
          job={this.job}
        >
          {this.renderDetails()}
          {this.renderContent()}
          {this.shouldFloatingTabsShown && this.renderFloatingTabs()}
          {this.renderBottomBar()}
        </Container>
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
      </PopupRoute>
    )
  }
}

export default JobDetailsMobile
