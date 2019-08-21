import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import InfiniteScroll from 'react-infinite-scroll-component'
import Typography from '@material-ui/core/Typography'
import posed from 'react-pose'
import Chip from '@material-ui/core/Chip'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Menu from '@material-ui/core/Menu'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import JobSkeleton from '../../../../components/JobSkeleton'
import MDIcon from '../../../../components/MDIcon'
import jobState from '../jobState'
import { fab } from '../../../../services/stores'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Container = styled.div`
  display: block;

  .head {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #f7f7f7;
    border-bottom: 1px solid #e0e0e0;

    .title {
      font-size: 12pt;
      font-weight: 400;
      margin-left: 20px;
    }
  }

  .application-list {
    display: block;

    .title {
      margin-left: 20px;
    }

    .filters {
      padding: 0 20px;
      max-width: 480px;
      margin-bottom: 10px;
    }
  }
`

const StyledListItem = styled(ListItem)`
  && {
    transition: .3s;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;

    .middle {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 10px;

      .status {
        display: block;
        font-size: 10pt;
        background: #3798db;
        color: white;
        border-radius: 10px;
        padding: 0px 10px;
      }
    }

    .title {
      margin: 0;
    }

    .match-skills-title {
      font-size: 7pt;
    }

    .skills {
      margin-top: 10px;
    }
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

const STATUS_MAP = {
  APPLIED: 'APPLIED',
  IN_REVIEW: 'IN REVIEW',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
}

@observer
class Applications extends Component {
  @observable listPose = 'open'
  @observable selectedIndex = -1
  @observable isOptionsOpened = false
  @observable selectedList = null
  @observable selectedApplication = null
  @observable isDeclineAppDialogOpened = false
  @observable filter = 'all'

  options = [
    {
      label: 'Review',
      icon: <MDIcon icon="eye" />,
      onClick: () => {
        let { history, match } = this.props
        let jobId = match.params.job_id
        let applicationId = this.selectedApplication.id

        jobState.application = this.selectedApplication
        history.push(
          `/company/jobs/${jobId}/applications/${applicationId}`
        )
      }
    },
    {
      label: 'Decline',
      icon: <MDIcon icon="delete" />,
      onClick: () => {
        this.isOptionsOpened = false
        this.isDeclineAppDialogOpened = true
      }
    },
  ]

  componentDidMount() {
    jobState.navigationStep = 1
    jobState.resetApplications()
    jobState.fetchApplications(this.props.match.params.job_id)
    fab.isActive = false
  }

  renderApplicationSkeleton() {
    if (jobState.applications.length === 0) return (
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

  fetchApplications = () => {
    jobState.fetchApplications(this.props.match.params.job_id)
  }

  renderList() {
    let applications = jobState.applications

    if (this.filter !== 'all') applications = applications.filter(d => {
      if (!d.currentStatus) return true
      if (d.currentStatus.status === this.filter) return true
      return false
    })

    return (
      <InfiniteScroll
        dataLength={jobState.applications.length}
        next={this.fetchApplications}
        hasMore={jobState.hasMoreApplications}
        loader={this.renderApplicationSkeleton()}
        endMessage={
          <p style={{
            textAlign: 'center',
            fontWeight: 100,
            fontSize: '11pt'
          }}>
            <span>All applications already fetched!</span>
          </p>
        }
        scrollableTarget="application-list"
      >
        {
          applications.map((d, i) => {
            let status = d.currentStatus && d.currentStatus.status
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
            
            return (
              <React.Fragment key={i}>
                <PosedListItem 
                  index={i}
                  pose={this.listPose} 
                  initialPose="closed"
                  onClick={() => {
                    let { history, match } = this.props
                    let jobId = match.params.job_id

                    jobState.application = this.selectedApplication
                    history.push(
                      `/company/jobs/${jobId}/applications/${d.id}`
                    )
                  }}
                  selected={!this.isMobile && d.id === this.selectedId}
                  button>
                  <ListItemAvatar>
                    <Avatar alt="Avatar" src={d.candidateProfilePicture} />
                  </ListItemAvatar>

                  <div className="middle" >
                    <div className="status" style={{background: statusColor}} >
                      {STATUS_MAP[status]}
                    </div>
                    <h3 className="title" >  
                      {d.candidateFirstName} {d.candidateLastName}
                    </h3>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                      style={{display: 'block'}}
                    >
                      {d.candidateCountry || 'Japan'}
                    </Typography>
                    {
                      d.matchSkills && (
                        <React.Fragment>
                          <div className="skills" >
                            {Object.keys(d.matchSkills).map((s, i) => (
                              <Chip
                                key={i}
                                label={s}
                                color="primary"
                                style={{height: 24}}
                              />
                            ))}
                          </div>
                        </React.Fragment>
                      )
                    }
                  </div>
                  <ListItemSecondaryAction>
                    <IconButton onClick={e => {
                      this.selectedList = e.currentTarget
                      this.selectedApplication = d
                      this.selectedIndex = i
                      this.isOptionsOpened = true
                    }} edge="end" >
                      <MDIcon 
                        icon="dots-vertical"
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

  filters = [
    {
      label: 'ALL STATUS',
      value: 'all',
    },
    {
      label: 'APPLIED',
      value: 'APPLIED',
    },
    {
      label: 'IN REVIEW',
      value: 'IN_REVIEW',
    },
    {
      label: 'APPROVED',
      value: 'APPROVED',
    },
    {
      label: 'DECLINED',
      value: 'DECLINED',
    },
  ]

  render() {
    let name = ''
    if (this.selectedApplication) {
      let {
        candidateFirstName = 'First Name',
        candidateLastName = 'Last Name',
      } = this.selectedApplication || {}
  
      name = `${candidateFirstName} ${candidateLastName}`
    }

    return (
      <Container >
        <div className="application-list custom-scroll" id="application-list" >
          <h2 className="title" >Applications</h2>
          <div className="filters" >
            <TextField
              className="filter-item"
              select
              label="Status Filter"
              value={this.filter}
              onChange={e => this.filter = e.target.value}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              {
                this.filters.map((d, i) => 
                <MenuItem value={d.value} key={i}>{d.label}</MenuItem>)
              }
            </TextField>
          </div>
          {this.renderLists()}
        </div>
        <Menu
          elevation={1}
          anchorEl={this.selectedList}
          open={Boolean(this.selectedList)}
          onClose={() => this.selectedList = null}
          PaperProps={{style:{ boxShadow: '1px 1px 10px #0000002b' }}}
        >
          {this.options.map((option, i) => (
            <ListItem 
              onClick={() => {
                this.selectedList = null
                option.onClick()
              }} 
              button key={i}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </Menu>

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
            {this.selectedApplication && (
              <DialogContentText id="alert-dialog-slide-description">
                Decline application for {name}?
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              if (this.selectedApplication) {
                await jobState.updateProgress(this.selectedApplication.id, 'DENIED', true)
              }
              this.isDeclineAppDialogOpened = false
            }} color="secondary">
              Decline
            </Button>
            <Button onClick={() => {
              this.isDeclineAppDialogOpened = false
            }} color="primary">
              Cancel
            </Button>
          </DialogActions>
          </div>
        </Dialog>
      </Container>
    )
  }
}

export default Applications