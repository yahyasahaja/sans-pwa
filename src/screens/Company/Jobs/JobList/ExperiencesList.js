import React, { Component } from 'react'
import Chip from '@material-ui/core/Chip'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import MDIcon from '../../../../components/MDIcon'
import moment from 'moment'
import styled from 'styled-components'
import posed from 'react-pose'
import { observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import BlockchainWrapper from '../../../../components/BlockchainWrapper';

const Container = styled.div`
  width: 100%;

  .list {
    display: block;

    .list-wrapper {
      display: block;
      color: #565656;
      width: 100%;

      .list-left-right {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .list-title {
          font-size: 11pt;
          font-weight: bold;
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
    position: relative;

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

@observer
class ExperiencesList extends Component {
  @observable listPose = 'open'
  
  renderList() {
    let { app_id, job_id } = this.props.match.params

    return (
      <List className="list" style={{padding: 0}}>
        {
          this.props.experiences.map((d, i) => (
            <React.Fragment key={i}>
              <PosedListItem 
                index={i}
                pose={this.listPose} 
                initialPose="closed"
                onClick={() => {
                  this.props.history.push(
                    `/company/jobs/${job_id}/applications/${app_id}/experience`,
                    {
                      experience: toJS(d)
                    }
                  )
                }}
                button>
                <BlockchainWrapper
                  title={d.position}
                  bottom
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

                <div className="list-wrapper" >
                  <div className="list-left-right" >
                    <div className="list-title" >{d.position}</div>
                    <div>
                      {moment(d.startAt).format('DD MMM YYYY')}
                        {' - '}
                      {moment(d.endDate).format('DD MMM YYYY')}
                    </div>
                  </div>
                  <div className="list-left-right" >
                    <div className="company" >
                      {d.company}
                    </div>
                    <div className="location" >
                      <MDIcon style={{fontSize: '10pt'}} icon="map-marker" />{d.location}
                    </div>
                  </div>
                  {
                    d.skills && (
                      <React.Fragment>
                        <div className="list-skills" >
                          {d.skills.map((s, i) => (
                            <Chip
                              className="chip"
                              key={i}
                              label={s.skillName}
                              color="primary"
                              style={{height: 24}}
                            />
                          ))}
                        </div>
                      </React.Fragment>
                    )
                  }
                </div>
              </PosedListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        }
      </List>
    )
  }

  render() {
    return (
      <Container>
        {this.renderList()}
      </Container>
    )
  }
}

export default ExperiencesList