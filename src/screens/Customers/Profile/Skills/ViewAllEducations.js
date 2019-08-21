import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import styled from 'styled-components'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import posed from 'react-pose'
import Typography from '@material-ui/core/Typography'
import MediaQuery from 'react-responsive'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'

import MDIcon from '../../../../components/MDIcon'
import profileState from '../profileState'
import ViewRoute from '../../../../components/ViewRoute'
import JobSkeleton from '../../../../components/JobSkeleton'

const Container = styled.div`
  display: block;
  padding: 20px;

  .more-info {
    margin-top: 20px;
  }
  
  .main {
    display: flex;

    .main-info {
      display: block;
      margin-left: 20px;

      .position {
        font-size: 20pt;
        font-weight: 300;
      }

      .company {
        font-size: 15pt;
      }
    }

    .image {
      width: 150px;
      height: 150px;
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

let education = {
  company: "company",
  description: "description",
  endDate: "2019-07-29T08:10:23.263+0000",
  location: "Osaka, Japan",
  position: "Software Developer",
  skills: [{skillName: "Java"}],
  startAt: "2019-07-29T08:10:23.261+0000",
}

@observer
class ViewAllEducations extends Component {
  @observable education = null
  @observable isFetchingExperience = false
  @observable listPose = 'open'
  @observable isOptionsOpened = false
  @observable selectedList = null
  @observable selectedExperience = null
  @observable selectedIndex = -1

  options = [
    {
      label: 'Edit',
      icon: <MDIcon icon="pencil" />,
      onClick: () => {
        this.props.history.push(
          `/customers/profile/educations/${this.selectedExperience.id}/edit`,
          {
            education: toJS(this.selectedExperience)
          }
        )
      },
    },
    {
      label: 'Delete',
      icon: <MDIcon icon="delete" />,
      onClick: () => {
        this.isDeleteDialogOpen = true
      }
    },
  ]

  componentDidMount() {
    this.fetchExperience()
  }

  fetchExperience() {
    // console.log(this.props.location.state)

    let { location: { state } } = this.props
    if (state && state.education) {
      this.education = state.education
    } else {
      this.isFetchingExperience = true
    }

    try {
      this.education = education

      this.isFetchingExperience = false
    } catch (err) {
      this.isFetchingExperience = false
      console.log('ERROR WHILE FETCHING EXPERIENCE', err)
    }
  }

  renderEducations() {
    if (profileState.isFetchingProfile) return (
      <JobSkeleton />
    )

    if (!profileState.profile) return(
      <div className="not-completed" >
        <div className="wrapper" >
          <div className="text" >Your Profile hasn't completed yet</div>
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.props.history.push('/customers/profile/general/edit')}
            >Complete Profile</Button>
          </div>
        </div>
      </div>
    )

    return (
      <List style={{padding: 0}}>
        {this.renderList()}
      </List>
    )
  }

  renderList() {
    return profileState.profile.educations.map((d, i) => (
      <React.Fragment key={i}>
        <PosedListItem 
          index={i}
          pose={this.listPose} 
          initialPose="closed"
          onClick={() => {
            this.props.history.push(`/customers/profile/educations/${d.id}/edit`)
          }}
          button>
          <ListItemText
            primary={d.major}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  style={{display: 'block'}}
                >
                  {d.degree}
                </Typography>
                {d.school}
                <span style={{display: 'block'}}>
                  {d.startYear} - {d.endYear || 'Now'}
                </span>
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <IconButton onClick={e => {
              this.selectedList = e.currentTarget
              this.selectedExperience = d
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
    ))
  }

  render() {
    return (
      <ViewRoute 
        onSubmit={this.onSubmit}
        isLoading={profileState.isUpdatingGeneralProfile}
        title="Edit Profile" 
        backPath="/customers/profile"
        close={close => this.close = close} >
        <Container>
          {this.renderEducations()}
          <MediaQuery maxWidth={800}>
            <Drawer
              anchor="bottom"
              open={this.isOptionsOpened}
              onClose={() => this.isOptionsOpened = false}
              PaperProps={{style:{ borderRadius: '20px 20px 0 0' }}}
            >
              <div
                className="bottom-sheet"
                role="presentation"
                onClick={() => this.isOptionsOpened = false}
                onKeyDown={() => this.isOptionsOpened = false}
              >
                <List>
                  {this.options.map((option, i) => (
                    <ListItem onClick={option.onClick} button key={i}>
                      <ListItemIcon>{option.icon}</ListItemIcon>
                      <ListItemText primary={option.label} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </Drawer>
          </MediaQuery>
          <MediaQuery minWidth={800}>
            <Menu
              elevation={1}
              anchorEl={this.selectedList}
              open={Boolean(this.selectedList)}
              onClose={() => this.selectedList = null}
              PaperProps={{style:{ boxShadow: '1px 1px 10px #0000002b' }}}
            >
              {this.options.map((option, i) => (
                <ListItem onClick={option.onClick} button key={i}>
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText primary={option.label} />
                </ListItem>
              ))}
            </Menu>
          </MediaQuery>
        </Container>
      </ViewRoute>
    )
  }
}

export default ViewAllEducations