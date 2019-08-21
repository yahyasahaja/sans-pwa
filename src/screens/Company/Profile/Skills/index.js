import React, { Component } from 'react'
// import { observable } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import MediaQuery from 'react-responsive'

import ChipSelect from '../../../../components/ChipSelect'
import profileState from '../profileState'
import JobSkeleton from '../General/GeneralSkeleton'

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
    padding: 20px;

    @media only screen and (min-width: 800px) {
      padding-top: 0;
    }
  }
`

const dummySkills = [
  'Java',
  'Javascript/NodeJS',
  'React JS',
  'Vue JS',
  'Angular',
  'Go',
  'Data Analysis',
  'PHP',
]

@observer
class Skills extends Component {
  renderContent() {
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
      <div className="content" >
        
      </div>
    )
  }

  render() {
    return (
      <Container>
        <MediaQuery minWidth={800} >
          <div className="title-wrapper" >
            <h2 className="title" >Change Password</h2>
          </div>
        </MediaQuery>

        {this.renderContent()}
      </Container>
    )
  }
}

export default Skills