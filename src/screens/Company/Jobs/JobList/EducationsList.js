import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import MDIcon from '../../../../components/MDIcon'
import moment from 'moment'
import styled from 'styled-components'
import posed from 'react-pose'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

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
class EducationsList extends Component {
  @observable listPose = 'open'
  
  renderList() {
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

export default EducationsList