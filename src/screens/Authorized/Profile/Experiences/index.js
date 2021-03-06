import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import List from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import { Route, Switch } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import posed from 'react-pose'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/core/Menu'
import Fab from '@material-ui/core/Fab'
import ReactDOM from 'react-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import JobSkeleton from '../../../../components/JobSkeleton'
// import EditExperiences from './EditExperiences'
import ViewExperiences from './ViewExperiences'
import profileState from '../profileState'
import MDIcon from '../../../../components/MDIcon'
// import AddExperience from './AddExperience'
import ViewAllExperiences from './ViewAllExperiences'
import { responsive } from '../../../../services/stores'
import UpdateExperience from './UpdateExperience'
import BlockchainWrapper from '../../../../components/BlockchainWrapper';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

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

const FabContainer = styled.div`
  display: block;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1300;
  box-shadow: 1px 1px 10px #0000002b;
  border-radius: 20px;

  .MuiFab-root {
    box-shadow: none;
  }

  .fab-label {
    display: block;
    margin-left: 10px;
  }
`

const Container = styled.div`
  display: block;
  background: white;
  
  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      margin-left: 20px;
    }
  }

  .button {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
  }

  @media only screen and (min-width: 800px) {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 1px 1px 10px #0000002b;
    margin: 30px 0;
    border: 1px solid #e6e6e6;
  }

  @media only screen and (max-width: 800px) {
    padding-bottom: 100px;
  }
  
  .not-completed {
    padding: 20px;
    
    .wrapper {
      display: flex;
      text-align: center;
      justify-content: center;
      flex-direction: column;
      padding: 100px;
      border: 2px dashed #e6e6e6;
      border-radius: 30px;

      .text {
        font-size: 15pt;
        font-weight: 300;
        margin: 20px 0;
      }
    }
  }

  .content {
    display: block;
    position: relative;

    .profile-picture-wrapper {
      display: flex;
      margin-top: -75px;
      justify-content: center;
      width: 100%;

      .profile-picture {
        width: 150px;
        height: 150px;
        border: 5px solid white;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 1px 8px 11px 0px #00000038;

        img {
          height: 100%;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      top: 75px;
      width: 100%;
    }

    .details {
      text-align: center;
      margin-top: 20px;
      padding-bottom: 20px;

      .name {
        font-size: 18pt;
        color: #34495e;
        font-weight: 300;
      }

      .description {
        font-size: 15pt;
      }

      .others {
        display: block;
      }
    }
  }
`

@observer
class Experiences extends Component {
  @observable isLoading = false
  @observable profile = null
  @observable shouldCompleteProfile = false
  @observable listPose = 'open'
  @observable selectedIndex = -1
  @observable isOptionsOpened = false
  @observable selectedList = null
  @observable selectedExperience = null
  @observable readyToRenderFab = false
  @observable isDeleteDialogOpen = false

  options = [
    {
      label: 'View',
      icon: <MDIcon icon="eye" />,
      onClick: () => {
        this.props.history.push(
          `/customers/profile/experiences/${this.selectedExperience.id}`,
          {
            experience: toJS(this.selectedExperience)
          }
        )
      }
    },
    {
      label: 'Edit',
      icon: <MDIcon icon="pencil" />,
      onClick: () => {
        console.log('selected', this.selectedExperience)
        this.props.history.push(
          `/customers/profile/experiences/${this.selectedExperience.id}/edit`,
          {
            experience: toJS(this.selectedExperience)
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
    // profileState.fetchProfile()
    this.readyToRenderFab = true
  }

  renderExperiences() {
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
    let experiences = profileState.profile.experiences
    if (!responsive.isMobile) experiences = experiences.slice(0, 2)

    return experiences.map((d, i) => (
      <React.Fragment key={i}>
        <PosedListItem 
          index={i}
          pose={this.listPose} 
          initialPose="closed"
          onClick={() => {
            this.props.history.push(
              `/customers/profile/experiences/${d.id}`,
              {
                experience: toJS(d)
              }
            )
          }}
          button>
          <BlockchainWrapper
            title={d.position}
            data={[
              {
                label: 'Candidate Blockchain Address',
                value: d.candidateBlockchainAddress,
              },
              {
                label: 'Company Blockchain Address',
                value: d.companyBlockchainAddress,
              }
            ]}
          />
          <ListItemAvatar>
            <Avatar alt="Avatar" src={d.companyLogoUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={d.position}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  style={{display: 'block'}}
                >
                  {d.company}
                </Typography>
                <MDIcon style={{fontSize: '10pt'}} icon="map-marker" />{d.location}
                <span style={{display: 'block'}}>
                  {moment(d.startAt).calendar()} - {moment(d.endDate).calendar()}
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

  renderFab() {
    if (this.props.isActive && this.readyToRenderFab) return ReactDOM.createPortal(
      <FabContainer className="fab" >
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          size="medium"
          onClick={() => this.props.history.push('/customers/profile/experiences/add')}
        >
          <MDIcon icon="plus-circle" />
          <span className="fab-label" >Add Experiences</span>
        </Fab>
      </FabContainer>,
      document.body,
    )
  }

  render() {
    return (
      <Container>
        <MediaQuery minWidth={800}>
          <div className="title-wrapper" >
            <h2 className="title" >Experiences</h2>
            <div>
              <IconButton 
                onClick={() => this.props.history.push('/customers/profile/experiences/add')} 
                size="medium" >
                <MDIcon icon="plus-circle" />
              </IconButton>
            </div>
          </div>
        </MediaQuery>
        
        {this.renderExperiences()}
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
              <ListItem onClick={() => {
                option.onClick()
                this.selectedList = null
              }} button key={i}>
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </Menu>
        </MediaQuery>
        <MediaQuery minWidth={800}>
          <div className="button" >
            <Button onClick={() => {
              this.props.history.push('/customers/profile/experiences/view')
            }} variant="outlined" color="primary">
              See More
            </Button>
          </div>
        </MediaQuery>
        {this.renderFab()}
        <Switch>
          <Route path="/customers/profile/experiences/view" component={ViewAllExperiences} />
          <Route path="/customers/profile/experiences/add" component={UpdateExperience} />
          <Route path="/customers/profile/experiences/:id/edit" component={UpdateExperience} />
          <Route path="/customers/profile/experiences/:id" component={ViewExperiences} />
        </Switch>

        <Dialog
          open={this.isDeleteDialogOpen}
          TransitionComponent={Transition}
          onClose={() => {
            this.isDeleteDialogOpen = false
          }}
        >
          <DialogTitle>Deletion Alert</DialogTitle>
          <DialogContent>
            {this.selectedExperience && (
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete {this.selectedExperience.position} 
                at {this.selectedExperience.company} experience?
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              await profileState.deleteExperience(this.selectedExperience.id)
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
      </Container>
    )
  }
}

export default Experiences