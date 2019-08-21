import React, { Component } from 'react'

import PopupRoute from '../../../../components/PopupRoute'
import jobState from '../jobState'
import ApplicationDetail from './ApplicationDetail'

class ApplicationDetailMobile extends Component {
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
        <ApplicationDetail {...this.props} />
      </PopupRoute>
    )
  }
}

export default ApplicationDetailMobile