import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Applications from './Applications'
import PopupRoute from '../../../../components/PopupRoute'
import jobState from '../jobState'
import ApplicationDetailMobile from './ApplicationDetailMobile'

class ApplicationsMobile extends Component {
  render() {
    let {
      candidateFirstName = 'First Name',
      candidateLastName = 'Last Name',
    } = jobState.application || {}

    let name = `${candidateFirstName} ${candidateLastName}`

    return (
      <PopupRoute 
        title={name}
        backPath={`/company/jobs/${this.props.match.params.job_id}/applications`}
        onScroll={this.onScroll}
        close={close => this.close = close}
      >
        <Applications {...this.props} />
        <Switch>
          <Route 
            path="/company/jobs/:job_id/applications/:app_id" 
            component={ApplicationDetailMobile} 
          />
        </Switch>
      </PopupRoute>
    )
  }
}

export default ApplicationsMobile