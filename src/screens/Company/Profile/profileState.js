import { observable, action } from 'mobx'
import axios from 'axios'
import { snackbar } from '../../../services/stores';

//CONFIG
const PROFILE_STORAGE_URI = 'jobwher_storage_profile_company'

class ProfileState {
  @observable profile = null
  @observable isFetchingProfile = false
  @observable isFetchingExperience = false
  @observable isUpdatingGeneralProfile = false
  @observable isUpdatingCV = false
  @observable isUpdatingEducation = false
  @observable isUpdatingExperiences = false
  @observable isUpdatingLogo = false
  @observable isUpdatingBanner = false

  @action
  async fetchProfile() {
    try {
      this.getProfileLocal()
      if (!this.profile) this.isFetchingProfile = true

      let {
        data
      } = await axios.get('/company/profile')

      this.profile = data
      this.setProfileLocal(data)

      this.isFetchingProfile = false
      return data
    } catch (err) {
      this.isFetchingProfile = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  getProfileLocal() {
    this.profile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_URI))
  }

  @action
  setProfileLocal(profile) {
    localStorage.setItem(PROFILE_STORAGE_URI, JSON.stringify(profile || this.profile))
  }

  @action
  async updateGeneralProfile(profile, logo, banner) {
    try {
      this.isUpdatingGeneralProfile = true
      
      await axios.put('/company/profile', profile)

      if (logo) await this.updateLogo(logo)
      if (banner) await this.updateBanner(banner)

      this.isUpdatingGeneralProfile = false
      this.fetchProfile()
    } catch (err) {
      this.isUpdatingGeneralProfile = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err.response)
    }
  }

  @action
  updateLogo = async file => {
    try {
      this.isUpdatingLogo = true
      let formData = new FormData()
      formData.append('logo', file)
      
      await axios.put('/company/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.isUpdatingLogo = false
    } catch (err) {
      this.isUpdatingLogo = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  updateBanner = async file => {
    try {
      this.isUpdatingBanner = true
      let formData = new FormData()
      formData.append('banner', file)

      await axios.put('/company/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.isUpdatingBanner = false
    } catch (err) {
      this.isUpdatingBanner = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }
}

export default new ProfileState()