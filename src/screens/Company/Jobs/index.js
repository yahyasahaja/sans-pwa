import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
// import { observable } from 'mobx'
// import { observer } from 'mobx-react'

import JobList from './JobList'
import BaseRoute from '../../../components/BaseRoute'
// import customersState from '../customersState'

class Jobs extends Component {
  render() {
    return (
      <BaseRoute noPadding>
        <Switch>
          <Route path={[
            '/company/jobs/:job_id',
            '/company/jobs'
          ]} component={JobList} />
        </Switch>
      </BaseRoute>
    )
  }
}

export default Jobs