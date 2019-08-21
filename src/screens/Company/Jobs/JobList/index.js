import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import InfiniteScroll from 'react-infinite-scroll-component'
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import moment from 'moment'
import posed from 'react-pose'

import { fab, responsive } from '../../../../services/stores'
// import CircularProgress from '@material-ui/core/CircularProgress'
// import MDIcon from '../../../../components/MDIcon'
import JobSkeleton from '../../../../components/JobSkeleton'
import JobDetailsWeb from './JobDetailsWeb'
import JobDetailsMobile from './JobDetailsMobile'
import axios from 'axios';
import jobState from '../jobState'
import MDIcon from '../../../../components/MDIcon'
import UpdateJob from './UpdateJob'
import ViewExperiences from './ViewExperiences'
import ApplicationDetail from './ApplicationDetail'
import Applications from './Applications'
import BlockchainWrapper from '../../../../components/BlockchainWrapper';

const JobDetailsWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .icon {
    display: block;
    font-size: 100pt;
    color: #dadada;
    line-height: 1;
  }

  .empty-text {
    color: #a0a0a0;
  }
`

const Container = styled.div`
  display: block;
  width: 100%;
  position: relative;
  min-height: 100%;
  background: white;
  
  @media (max-width: 480px) {
    padding-bottom: 60px;
  }

  .job-list-wrapper {
    width: 100%;
    display: flex;

    .job-list {
      width: 40%;
      max-width: 480px;
      overflow-y: auto;
      height: 100vh;
      border-right: 1px solid #e0e0e0;
      min-width: 350px;

      .infinite-scroll-component {
        overflow-x: hidden !important;
      }
    }

    .details {
      width: 100%;
      overflow-y: auto;
      height: calc(100vh - 80px);
    }
  }

  .job-details {
    width: 100%;
    overflow: hidden;
  }
`

const StyledListItem = styled(ListItem)`
  && {
    transition: .3s;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }

  span {
    color: rgba(55, 152, 219, 1);
  }

  &.MuiListItem-root.Mui-selected, &.MuiListItem-root.Mui-selected:hover{
    background-color: rgba(55, 152, 219, .05);
    border: 1px solid #3798db;
    border-left: 10px solid #3798db;
    transition: .3s;
  }

  .MuiListItemText-multiline span {
    color: inherit;
  }
`

const PosedListItem = posed(StyledListItem)({
  open: { 
    x: 0, 
    opacity: 1, 
    delay: ({index}) => (index % 10) * 100}
  ,
  closed: { x: 20, opacity: 0 }
})

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

// const exampleData = {
//   id: 0,
//   title: 'Amazon FC IT Support Engineer',
//   city: 'Sakai',
//   created_at: new Date('18 June 2019'),
//   favorited: false,
//   salary: {
//     amount: 3000000,
//     currency: 'JPY',
//     payment: 'yr'
//   },
//   description: 'Amazon software engineer recruitment, for Flutter Developer',
//   banner: '/images/amazon-logo.jpg',
//   company: {
//     name: 'Amazon',
//     description: 'A huge marketplace',
//     logo: '/images/amazon-logo.jpg',
//   }
// }

// const example5Data = [...Array(10)].map((d, i) => ({
//   ...JSON.parse(JSON.stringify(exampleData)),
//   id: i + 1,
// }))

@observer
class JobList extends Component {
  @observable search = ''
  @observable time = 1
  @observable industry = 1
  @observable page = 0
  @observable jobs = []
  @observable shouldFetchJobs = false
  @observable hasMoreJobs = true
  @observable isFetching = false
  @observable containerPose = 'open'
  @observable listPose = 'open'
  @observable selectedId = -1
  @observable isMobile = false
  @observable selectedIndex = 0

  componentDidMount() {
    let { job_id } = this.props.match.params

    if (job_id) {
      this.selectedId = job_id
    }
    this.fetchJobs()

    fab.icon = <MDIcon icon="plus" />
    fab.onClick = () => this.props.history.push('/company/jobs/new')
    fab.isActive = true
  }

  validate(str) {
    if (!str || str === 'null' || str === 'undefined') return ''
    else return str
  }

  componentWillUnmount() {
    if (this.searchTimeoutId) clearTimeout(this.searchTimeoutId)
    fab.isActive = false
  }

  fetchJobs = async () => {
    if (!this.hasMoreJobs) return

    this.isFetching = true
    try {
      let query = new URLSearchParams()

      if (this.search) {
        query.append('search', this.search)
      }

      query.append('page', this.page)
      
      let {
        data: {
          content,
          totalPages,
        }
      } = await axios.get('/company/job?orderBy=createdAt&order=desc')

      this.jobs = [...this.jobs, ...content]
      this.hasMoreJobs = this.page < totalPages - 1
      if (this.hasMoreJobs) this.page++
      this.isFetching = false
      // console.log(content)
    } catch (err) {
      console.log('ERROR WHILE FETCHING JOB', err)
    }
  }

  renderJobSkeleton() {
    if (this.jobs.length === 0) return (
      <React.Fragment>
        <JobSkeleton /> 
        <JobSkeleton /> 
        <JobSkeleton /> 
        <JobSkeleton /> 
        <JobSkeleton /> 
      </React.Fragment>
    ) 
    return (
      <React.Fragment>
        <JobSkeleton /> 
        <JobSkeleton /> 
      </React.Fragment>
    )
  }

  renderList() {
    return (
      <InfiniteScroll
        dataLength={this.jobs.length}
        next={this.fetchJobs}
        hasMore={this.hasMoreJobs}
        loader={this.renderJobSkeleton()}
        endMessage={
          <p style={{
            textAlign: 'center',
            fontWeight: 100,
            fontSize: '11pt'
          }}>
            <span>All jobs already fetched!</span>
          </p>
        }
        scrollableTarget="job-list"
      >
        {
          this.jobs.map((d, i) => (
            <React.Fragment key={i}>
              <PosedListItem 
                index={i}
                pose={this.listPose} 
                initialPose="closed"
                onClick={() => {
                  let querystring = window.location.search
                  if (responsive.isMobile) {
                    this.props.history.push(`/company/jobs/${d.id}${querystring}`)
                    return
                  }

                  this.selectedId = -1
                  setTimeout(() => {
                    let querystring = window.location.search
                    this.props.history.push(`/company/jobs/${d.id}${querystring}`)
                    this.selectedId = d.id
                    jobState.job = d
                    this.selectedIndex = i
                  }, 100)
                }}
                selected={!responsive.isMobile && d.id === this.selectedId}
                button>
                <BlockchainWrapper
                  title={d.position}
                  data={[
                    {
                      label: 'Blockchain Address',
                      value: d.blockchainAddress,
                    },
                  ]}
                />
                <ListItemAvatar>
                  <Avatar alt="Avatar" src={d.bannerUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={d.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        style={{display: 'block'}}
                      >
                        {d.companyName}
                      </Typography>
                      {d.city}
                      <span style={{display: 'block'}}>
                        {moment(d.createdAt).calendar()}
                      </span>
                    </React.Fragment>
                  }
                />
              </PosedListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        }
      </InfiniteScroll>
    )
  }
  
  renderLists() {
    return (
      <List style={{padding: 0}}>
        {this.renderList()}
      </List>
    )
  }

  getJobById = id => {
    return this.jobs.find(d => d.id === parseInt(id))
  }

  renderWebRoutes = () => {
    return (
      <Switch>
        <Route path="/company/jobs/new" component={UpdateJob} />
        <Route path="/company/jobs/:job_id/update" component={UpdateJob} />
        <Route 
          path="/company/jobs/:job_id/applications/:app_id/experience" 
          component={ViewExperiences} 
        />
      </Switch>
    )
  }

  renderWebDetails = () => {
    if (this.selectedId === -1) {
      return (
        <JobDetailsWrapper>
          <div className="mdi mdi-clipboard-text icon" />
          <div className="empty-text">Choose a Job to see details</div>
          {this.renderWebRoutes()}
        </JobDetailsWrapper>
      )
    }

    return (
      <React.Fragment>
        <Route path="/company/jobs/:job_id" render={props => <JobDetailsWeb 
          {...props}
          job={this.getJobById(this.props.match.params.job_id)}
        />}/>
        {this.renderWebRoutes()}
      </React.Fragment>
    )
  }

  renderJobs() {
    return (
      <React.Fragment>
        <MediaQuery maxWidth="480px">
          {this.renderLists()}
          
          <Switch>
            <Route path="/company/jobs/new" component={UpdateJob} />
            <Route path="/company/jobs/:job_id" render={props => <JobDetailsMobile 
              {...props}
              job={this.getJobById(this.props.match.params.job_id)}
            />} />
          </Switch>
        </MediaQuery>
        <MediaQuery minWidth="480px">
          <div className="job-list-wrapper" >
            <div className="job-list custom-scroll" id="job-list" >
              {this.renderLists()}
            </div>

            <div className="job-details">
              {this.renderWebDetails()}
            </div>
          </div>
        </MediaQuery>
      </React.Fragment>
    )
  }

  render() {
    return (
      <PosedContainer
        pose={this.containerPose} 
        initialPose="close"
      >
        {this.renderJobs()}
      </PosedContainer>
    )
  }
}

window.moment = moment
export default JobList