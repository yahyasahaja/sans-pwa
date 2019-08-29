import { observable, action } from 'mobx'
import axios from 'axios'
import { snackbar, overlayLoading } from '../../../services/stores'

class JobState {
  @observable profile = null
  @observable isFetchingJobs = false
  @observable isFetchingJob = false
  @observable isFavoritingJob = false
  @observable isApplyingJob = false
  @observable isFetchingCompany = false
  @observable company = null

  @action
  async fetchJob(id, useLoading) {
    try {
      if (useLoading) this.isFetchingJob = true

      let {
        data
      } = await axios.get(`/jobs/${id}`)

      this.isFetchingJob = false
      return data
    } catch (err) {
      this.isFetchingJob = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  async fetchCompany(id) {
    try {
      this.isFetchingCompany = true
      let {
        data
      } = await axios.get(`/companies/${id}`)

      this.company = data
      this.isFetchingCompany = false
      return data
    } catch (err) {
      this.isFetchingCompany = false
      console.log('ERROR WHILE FETCHING COMPANY DATA', err.response)
    }
  }

  @action
  async favoriteJob(id, useLoading) {
    try {
      if (useLoading) this.isFavoritingJob = true

      let {
        data
      } = await axios.put(`/user/like?jobId=${id}`)

      this.isFavoritingJob = false

      return data
    } catch (err) {
      this.isFavoritingJob = false
      if (err.response.status === 400) snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  async applyJob(id, useLoading) {
    try {
      if (useLoading) {
        this.isApplyingJob = true
        overlayLoading.show()
      }

      let {
        data
      } = await axios.put(`/user/apply/${id}`)

      if (useLoading) {
        this.isApplyingJob = false
        overlayLoading.hide()
      }

      snackbar.show('Job applied, check dashboard to see progress')

      return data
    } catch (err) {
      if (useLoading) {
        this.isApplyingJob = false
        overlayLoading.hide()
      }
      if (err.response.status === 400) snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err.response)
    }
  }
}

export default new JobState()