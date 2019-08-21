import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
// import { observable } from 'mobx'
// import { observer } from 'mobx-react'

import JobsHome from './JobsHome'
import BaseRoute from '../../../components/BaseRoute'
// import customersState from '../customersState'

class Jobs extends Component {
  render() {
    return (
      <BaseRoute noPadding >
        <Switch>
          <Route path={[
            '/customers/jobs/favorites',
            '/customers/jobs/home/:job_id',
            '/customers/jobs/home'
          ]} component={JobsHome} />
        </Switch>
      </BaseRoute>
    )
  }
}

export default Jobs