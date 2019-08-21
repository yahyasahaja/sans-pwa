import { observable, action } from 'mobx'
import axios from 'axios'
import { snackbar, overlayLoading } from '../../../services/stores'
import applicationDataExample from './JobList/applicationDataExample'

class JobState {
  @observable job = null
  @observable isUpdatingJob = false
  @observable isFetchingJobs = false
  @observable isFetchingJob = false
  @observable isFavoritingJob = false
  @observable isDeletingJob = false
  @observable applications = []
  @observable shouldFetchApplications = false
  @observable hasMoreApplications = true
  @observable isFetchingApplications = false
  @observable isFetchingApplication = false
  @observable applicationsPage = 0
  @observable application = null
  @observable navigationStep = 0

  @action
  updateProgress = async (appId, progress, useLoading) => {
    try {
      if (useLoading) overlayLoading.show()
      let {
        data
      } = await axios.put(`/company/application/progress?id=${appId}&status=${progress}`)

      console.log(data)
      this.fetchApplication(appId)
      if (useLoading) overlayLoading.hide()
    } catch (err) {
      snackbar.show(err.response.data.message)
      if (useLoading) overlayLoading.hide()
      console.log('ERROR WHILE UPDATING PROGRESS', err.response)
    }
  }

  @action
  updateJob = async (data, id, banner) => {
    try {
      if (!id) delete data.id
      else data.id = id

      data.createdAt = (new Date()).toString()
      this.isUpdatingJob = true

      let {
        data: result
      } = await axios.put('/company/job', data)

      if (banner) await this.updateBanner(id || result.id, banner)

      this.isUpdatingJob = false
      return result
    } catch (err) {
      this.isUpdatingJob = false
      snackbar.show('There is an error occured, try again later')
      console.log('ERROR WHILE UPDATING JOB', err)
    }
  }

  @action
  updateBanner = async (jobId, file) => {
    try {
      this.isUpdatingLogo = true
      let formData = new FormData()
      formData.append('banner', file)
      
      await axios.put(`/company/job/banner/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.isUpdatingLogo = false
    } catch (err) {
      this.isUpdatingLogo = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  fetchApplication = async appId => {
    if (this.applications.length === 0) return
    this.applications.forEach(application => {
      if (application.id === appId) this.application = application
    })

    if (!this.application) this.isFetchingApplication = true

    try {
      let {
        data
      } = await axios.get(`/company/application/${appId}`)
      
      //TODO: check this later
      this.application = data
      this.isFetchingApplication = false
    } catch (err) {
      this.isFetchingApplication = false
      console.log('ERROR WHILE FETCHING APPLICATION', err.response)
    }
  }

  @action
  resetApplications() {
    this.applications = []
    this.shouldFetchApplications = false
    this.hasMoreApplications = true
    this.isFetchingApplications = false
    this.applicationsPage = 0
  }

  fetchApplications = async jobId => {
    if (!this.hasMoreApplications) return

    this.isFetching = true
    try {
      let query = new URLSearchParams()
      query.append('page', this.applicationsPage)

      let {
        data: {
          content,
          totalPages,
        }
      } = await axios.get(`/company/applications/${jobId}?${query.toString()}`)

      this.applications = [ ...this.applications, ...content ]

      //TODO: delete this when server ready
      // if (this.applications.length === 0) {
      //   this.applications = applicationDataExample.content
      //   this.isFetching = false
      //   this.hasMoreApplications = false
      //   return
      // }
      //


      this.hasMoreApplications = this.page < totalPages - 1
      if (this.hasMoreApplications) this.page++
      this.isFetching = false
    } catch (err) {
      this.applications = applicationDataExample.content
      this.hasMoreApplications = false
      this.isFetching = false
      console.log('ERROR WHILE FETCHING APPLICATIONS', err)
    }
  }

  @action
  async fetchJob(id) {
    try {
      if (!this.job) this.isFetchingJob = true

      let {
        data
      } = await axios.get(`/jobs/${id}`)

      this.job = data
      this.isFetchingJob = false
      return data
    } catch (err) {
      this.isFetchingJob = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  async deleteJob(id) {
    try {
      this.isDeletingJob = true
      overlayLoading.show()

      let {
        data
      } = await axios.delete(`/company/job/${id}`)

      this.isDeletingJob = false
      overlayLoading.hide()

      return data
    } catch (err) {
      snackbar.show(err.response.data.message)
      this.isDeletingJob = false
      overlayLoading.hide()
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }
}

export default window.jobState = new JobState()