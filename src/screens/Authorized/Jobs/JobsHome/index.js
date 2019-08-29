import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import FilterIcon from '@material-ui/icons/FilterList'
import Button from '@material-ui/core/Button'
import { observable } from 'mobx'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
// import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import InfiniteScroll from 'react-infinite-scroll-component'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import moment from 'moment'
import posed from 'react-pose'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import { fab } from '../../../../services/stores'
// import CircularProgress from '@material-ui/core/CircularProgress'
import MDIcon from '../../../../components/MDIcon'
import JobSkeleton from '../../../../components/JobSkeleton'
import JobDetailsWeb from './JobDetailsWeb'
import JobDetailsMobile from './JobDetailsMobile'
import axios from 'axios'
import profileState from '../../Profile/profileState'
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

// const LoadingWrapper = styled.div`
//   width: 100%;
//   margin: 20px 0;
//   display: flex;
//   justify-content: center;
// `

const StyledToolbar = styled(Toolbar)`
  && {
    min-height: 47px;
  }
`

const Container = styled.div`
  display: block;
  width: 100%;
  position: relative;
  min-height: 100%;
  background: white;

  .web-filters {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding: 0 5px;

    .filter-item {
      padding: 0 5px;
    }
  }
  
  @media (max-width: 480px) {
    padding-bottom: 60px;
  }

  .job-wrapper {
    width: 100%;
    display: flex;
    border-top: 1px solid #e0e0e0;

    .job-list-wrapper {
      display: block;
      border-right: 1px solid #e0e0e0;

      .favorite-switch {
        display: block;
        width: 100%;
        padding: 0 15px;
        border-bottom: 1px solid #e0e0e0;

        label {
          width: 100%;
        }
      }

      .job-list {
        width: 40%;
        max-width: 480px;
        min-width: 350px;
        overflow-y: auto;
        height: calc(100vh - 120px);
        position: relative;

        .infinite-scroll-component {
          overflow-x: hidden !important;
        }
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
    position: relative;
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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
class Home extends Component {
  @observable search = ''
  @observable country = ''
  @observable locationState = ''
  @observable isFilterWindowOpened = false
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
  @observable isFavoriteActive = false

  reset() {
    this.country = ''
    this.locationState = ''
    this.search = ''
    this.page = 0
  }

  componentWillReceiveProps(nextProps) {
    this.checkQueryStringChanges(nextProps)
    if (window.location.pathname.indexOf('favorites') !== -1) {
      this.isFavoriteActive = true
    }
  }

  componentDidMount() {
    let match = window.matchMedia('(max-width: 480px)')
    
    if (match.matches) {
      fab.icon = <FilterIcon />
      fab.onClick = this.onFabClick
      fab.isActive = true
      this.isMobile = true
    }

    let params = new URLSearchParams(window.location.search)
    this.coutnry = params.get('country') || this.country 
    this.locationState = params.get('locationState') || this.locationState
    this.search = params.get('search') || this.search

    this.changeQueryString()
    
    let { job_id } = this.props.match.params

    if (job_id) {
      this.selectedId = job_id
    }

    if (window.location.pathname.indexOf('favorites') !== -1) {
      this.isFavoriteActive = true
    }

    profileState.fetchProfile()
    // this.fetchJobs()
  }

  checkQueryStringChanges() {
    if (!this.shouldFetchJobs) return

    let params = new URLSearchParams(window.location.search)

    this.jobs = []
    this.page = 0
    this.hasMoreJobs = true
    this.locationState = params.get('locationState')
    this.country = params.get('country')
    this.search = params.get('search')
    this.fetchJobs()
    this.shouldFetchJobs = false
  }

  changeQueryString = () => {
    let {
      search,
      country,
      locationState,
    } = this

    search = this.validate(search)
    country = this.validate(country)
    locationState = this.validate(locationState)

    this.shouldFetchJobs = true
    this.props.history.push({
      pathname: window.location.pathname,
      search: '?' + new URLSearchParams({search, country, locationState}).toString()
    })
  }

  validate(str) {
    if (!str || str === 'null' || str === 'undefined') return ''
    else return str
  }

  onFabClick = () => {
    this.isFilterWindowOpened = true
  }

  componentWillUnmount() {
    if (this.searchTimeoutId) clearTimeout(this.searchTimeoutId)
    fab.isActive = false
  }

  searchTimeoutId = null
  handleSearchChange(name, event) {
    this[name] = event.target.value
    this.hasMoreJobs = false
    this.page = 0
    this.selectedId = -1

    if (this.searchTimeoutId) clearTimeout(this.searchTimeoutId)
    this.searchTimeoutId = setTimeout(() => {
      this.jobs = []
      this.changeQueryString()
    }, 1000)
  }

  fetchJobs = async () => {
    if (!this.hasMoreJobs) return

    this.isFetching = true
    try {
      let query = new URLSearchParams()

      // setTimeout(() => {
      //   this.jobs = JSON.parse(JSON.stringify([...this.jobs, ...example5Data])).map((d, i) => ({
      //     ...d,
      //     id: i + 1
      //   }))
      //   if (this.jobs.length > 200) this.hasMoreJobs = false
      //   this.isFetching = false
      // }, 1000)

      if (this.search) {
        query.append('search', this.search)
      }

      if (this.country) {
        query.append('country', this.country)
      }

      if (this.locationState) {
        query.append('state', this.locationState)
      }

      query.append('page', this.page)
      
      let {
        data: {
          content,
          totalPages,
        }
      } = await axios.get(`/jobs?${query.toString()}`)

      this.jobs = [...this.jobs, ...content]
      this.hasMoreJobs = this.page < totalPages - 1
      if (this.hasMoreJobs) this.page++
      this.isFetching = false
      // console.log(content)
    } catch (err) {
      console.log('ERROR WHILE FETCHING JOB', err)
    }
  }

  renderMobileFilter() {
    return (
      <MediaQuery maxWidth="800px">
        <Dialog 
          fullScreen 
          open={this.isFilterWindowOpened} 
          onClose={() => this.isFilterWindowOpened = false} 
          TransitionComponent={Transition}
        >
          <div style={{padding: 10, paddingTop: 52}} >
            <AppBar >
              <StyledToolbar>
                <IconButton edge="start" color="inherit" onClick={
                  () => this.isFilterWindowOpened = false
                } aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography style={{flex: 1}} variant="h6">
                  Filter
                </Typography>
              </StyledToolbar>
            </AppBar>
            
            {this.renderFilters()}

            <Button 
              size="large"
              variant="contained" 
              color="primary"
              style={{color: 'white', marginTop: 16}}
              type="submit"
              fullWidth
              onClick={() => {
                this.isFilterWindowOpened = false
              }}
            >
              Filter
              <FilterIcon style={{marginLeft: 10}} />
            </Button>
          </div>
        </Dialog>
      </MediaQuery>
    )
  }

  renderFilters() {
    return (
      <React.Fragment>
        <TextField
          className="filter-item"
          name="search"
          label="Search"
          onChange={this.handleSearchChange.bind(this, 'search')}
          value={this.search}
          fullWidth
          placeholder="Jobs, Company, or Keywords.."
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className="filter-item"
          name="country"
          label="Country"
          onChange={this.handleSearchChange.bind(this, 'country')}
          value={this.country}
          fullWidth
          placeholder="Type a country name"
          variant="outlined"
          margin="normal"
        />
        <TextField
          className="filter-item"
          name="state"
          label="State"
          onChange={this.handleSearchChange.bind(this, 'locationState')}
          value={this.locationState}
          fullWidth
          placeholder="Type a state name"
          variant="outlined"
          margin="normal"
        />
        
        {/* <TextField
          className="filter-item"
          select
          label="Country"
          value={this.country}
          onChange={this.handleSearchChange.bind(this, 'country')}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          {this.times.map((d, i) => <MenuItem value={i + 1} key={i}>{d}</MenuItem>)}
        </TextField> */}
      </React.Fragment>
    )
  }

  renderWebFilters() {
    return (
      <React.Fragment>
        <MediaQuery minWidth="800px" >
          <div className="web-filters" >
            {this.renderFilters()}
          </div>
        </MediaQuery>
      </React.Fragment>
    )
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
    let jobs = this.jobs

    if (this.isFavoriteActive) jobs = profileState.favoriteJobs

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
          jobs.map((d, i) => {
            profileState.favoriteJobs.slice()
            let isFavorited = profileState.checkFavoritedJob(d)

            return (
              <React.Fragment key={i}>
                <PosedListItem 
                  index={i}
                  pose={this.listPose} 
                  initialPose="closed"
                  onClick={() => {
                    let querystring = window.location.search
                    if (this.isMobile) {
                      this.props.history.push(`/customers/jobs/home/${d.id}${querystring}`)
                      return
                    }
  
                    this.selectedId = -1
                    setTimeout(() => {
                      let querystring = window.location.search
                      this.props.history.push(`/customers/jobs/home/${d.id}${querystring}`)
                      this.selectedId = d.id
                      this.selectedIndex = i
                    }, 100)
                  }}
                  selected={!this.isMobile && d.id === this.selectedId}
                  button>
                  <BlockchainWrapper
                    title={d.title}
                    data={[
                      {
                        label: 'Blockchain Address',
                        value: d.blockchainAddress,
                      }
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
                  <ListItemSecondaryAction>
                    
                    <IconButton 
                      onClick={() => profileState.toggleFavoriteJob(d)}
                      edge="end" 
                      aria-label="Comments">
                      <MDIcon 
                        color={isFavorited ? 'red' : undefined}
                        icon={`heart${isFavorited ? '' : '-outline'}`} 
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </PosedListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            )
          })
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
    return this.jobs.find(d => d.id === id)
  }

  renderWebDetails = () => {
    if (this.selectedId === -1) {
      return (
        <JobDetailsWrapper>
          <div className="mdi mdi-clipboard-text icon" />
          <div className="empty-text">Choose a Job to see details</div>
        </JobDetailsWrapper>
      )
    }

    return <Route path="/customers/jobs/home/:job_id" render={props => {
      let jobId = this.props.match.params.job_id
      return (
        <JobDetailsWeb 
          {...props}
          job={this.getJobById(jobId)}
        />
      )
    }}/>
  }

  renderFavoriteFilter() {
    return (
      <div className="favorite-switch" >
        <FormControlLabel
          control={
            <Switch
              checked={this.isFavoriteActive}
              onChange={() => this.isFavoriteActive = !this.isFavoriteActive}
              value="favorited"
              color="secondary"
            />
          }
          label="Show Favorite Jobs"
        />
      </div>
    )
  }

  renderJobs() {
    return (
      <React.Fragment>
        <MediaQuery maxWidth="480px">
          {this.renderLists()}
          <Route path="/customers/jobs/home/:job_id" render={props => <JobDetailsMobile 
            {...props}
            job={this.getJobById(this.props.match.params.job_id)}
          />} />
        </MediaQuery>
        <MediaQuery minWidth="480px">
          <div className="job-wrapper" >
            <div className="job-list-wrapper " >
              {this.renderFavoriteFilter()}
              <div className="job-list custom-scroll" id="job-list" >
                {this.renderLists()}
              </div>
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
        {this.renderMobileFilter()}
        {this.renderWebFilters()}
        {this.renderJobs()}
      </PosedContainer>
    )
  }
}

window.moment = moment
export default Home