import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import posed from 'react-pose'
import { Switch, Route, Link } from 'react-router-dom'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import JobDescription from './JobDescription'
import Applications from './Applications'
import jobState from '../jobState'
import UpdateJob from './UpdateJob'
import { fab } from '../../../../services/stores'
import MDIcon from '../../../../components/MDIcon'
import ApplicationDetail from './ApplicationDetail'
import ViewExperiences from './ViewExperiences'

const Container = styled.div`
  overflow: hidden;
  height: 100vh;
  overflow-y: auto;

  .navigation-back {
    height: 64px;
    width: 100%;
  }

  .navigation {
    padding: 10px;
    background: #f7f7f7;
    border-bottom: 1px solid #e0e0e0;
    position: fixed;
    z-index: 2;
    width: 100%;

    nav {
      height: 43px;
      display: flex;
    }

    .navigation-item {
      color: inherit;
      font-weight: 500;
      font-size: 11pt;
      border: 1px solid #bbbbbb00;
      padding: 10px 12px;
      border-radius: 50px;
      transition: .3s;

      &:hover {
        border: 1px solid #bbbbbb;
        transition: .3s;
      }

      &:active {
        opacity: .3;
        transition: .1s;
      }

      &:visited {
        color: inherit;
      }

      &.navigation-last {
        color: inherit;
        font-weight: bold;

        &:hover {
          border: 1px solid #bbbbbb00;
        }
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

@observer
class JobDetailsWeb extends Component {
  @observable containerPose = 'open'

  componentDidMount() {
    let jobId = this.props.match.params.job_id
    jobState.fetchJob(jobId)
    fab.icon = <MDIcon icon="plus" />
    fab.onClick = () => this.props.history.push('/company/jobs/new')
    fab.isActive = true
  }

  renderNavigation() {
    let step = jobState.navigationStep
    if (jobState.navigationStep === 0) return

    let jobTitle = (jobState.job && jobState.job.title) || ''
    let jobId = (jobState.job && jobState.job.id) || ''

    let navigation = [
      {
        label: jobTitle,
        to: `/company/jobs/${jobId}`
      },
    ]

    let lastLabel = 'Applications'

    if (step === 2) {
      navigation.push({
        label: 'Applications',
        to: `/company/jobs/${jobId}/applications`
      })
      let firstName = jobState.application ? jobState.application.candidateFirstName : 'First Name'
      let lastName = jobState.application ? jobState.application.candidateLastName : 'Last Name'
      let name = `${firstName} ${lastName}`
      lastLabel = name
    }

    return (
      <React.Fragment>
        <div className="navigation" >
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
          >
            {navigation.map((d, i) => (
              <Link 
                key={i}
                className="navigation-item" 
                to={d.to} >
                {d.label}
              </Link>
            ))}
            
            <div 
              className="navigation-item navigation-last"  >
              {lastLabel}
            </div>
          </Breadcrumbs>
        </div>
        <div className="navigation-back" />
      </React.Fragment>
    )
  }

  render() {
    return (
      <PosedContainer
        pose={this.containerPose} 
        initialPose="close"
        job={this.job}
        className="custom-scroll"
      >
        {this.renderNavigation()}
        
        <Switch>
          <Route 
            path="/company/jobs/:job_id/applications/:app_id" 
            component={ApplicationDetail} 
          />
          <Route path="/company/jobs/:job_id/applications" component={Applications} />
          <Route path="/company/jobs/:job_id" component={JobDescription} />
        </Switch>
      </PosedContainer>
    )
  }
}

export default JobDetailsWeb