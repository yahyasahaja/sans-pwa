import { observable, action } from 'mobx'
import axios from 'axios'
import { snackbar, overlayLoading } from '../../../services/stores'

//CONFIG
const PROFILE_STORAGE_URI = 'jobwher_storage_profile'
const FAVORITE_JOBS_STORAGE_URI = 'jobwher_storage_favoritejobs'

class ProfileState {
  @observable profile = null
  @observable isFetchingProfile = false
  @observable isUpdatingGeneralProfile = false
  @observable isUpdatingCV = false
  @observable experiences = []

  @observable isUpdatingSKills = false

  @observable isUpdatingEducation = false
  @observable isDeletingEducation = false

  @observable isUpdatingExperience = false
  @observable isDeletingExperience = false

  @observable isUpdatingProfilePicture = false
  @observable isUpdatingBanner = false
  @observable favoriteJobs = []

  @action
  toggleFavoriteJob = async data => {
    try {
      if (!this.checkFavoritedJob(data)) {
        data.candidateFavorit = true
        this.favoriteJobs.push(data)
      } else {
        data.candidateFavorit = false
        let favoriteJobs = this.favoriteJobs.slice()

        let index = -1
        for (let i = 0; i < favoriteJobs.length; i++) {
          if (favoriteJobs[i].id === data.id) {
            index = i
            break
          }
        }

        this.favoriteJobs.splice(index, 1)
      }

      this.setFavoriteJobsLocal()

      let {
        data: result
      } = await axios.put(`/user/like?jobId=${data.id}`)

      return result
    } catch (err) {
      if (err.response && err.response.status === 400) 
        snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  checkFavoritedJob(data) {
    if (!this.profile) return false
    if (!this.favoriteJobs) return false

    // console.log(this.favoriteJobs)
    let favoriteJobs = this.favoriteJobs.slice()

    for (let fav of favoriteJobs) {
      if (fav.id === data.id) return true
    }

    return false
  }

  @action
  async fetchProfile(fetchFavorites = true) {
    try {
      this.getProfileLocal()
      this.getFavoriteJobsLocal()
      if (!this.profile) this.isFetchingProfile = true

      let {
        data
      } = await axios.get('/user/profile')

      this.profile = data

      if (fetchFavorites) {
        let {
          data: favorites
        } = await axios.get('/user/favorites')
  
        this.favoriteJobs = favorites || []
        this.setFavoriteJobsLocal(favorites)
      }

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
  getFavoriteJobsLocal() {
    this.profile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_URI))
  }

  @action
  setFavoriteJobsLocal(favoriteJobs) {
    localStorage.setItem(
      FAVORITE_JOBS_STORAGE_URI, JSON.stringify(favoriteJobs || this.favoriteJobs)
    )
  }

  @action
  async updateGeneralProfile(profile, cv, profilePicture, banner) {
    try {
      this.isUpdatingGeneralProfile = true
      
      await axios.put('/user/profile', profile)

      if (cv) await this.updateCV(cv)
      if (profilePicture) await this.updateProfilePicture(profilePicture)
      if (banner) await this.updateBanner(banner)

      this.isUpdatingGeneralProfile = false
      this.fetchProfile()
    } catch (err) {
      this.isUpdatingGeneralProfile = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  async updateCV(cv) {
    try {
      this.isUpdatingCV = true
      let formData = new FormData()
      formData.append('cv', cv)

      await axios.put('/user/cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.isUpdatingCV = false
    } catch (err) {
      this.isUpdatingCV = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  updateProfilePicture = async file => {
    try {
      this.isUpdatingProfilePicture = true
      let formData = new FormData()
      formData.append('profilePicture', file)

      await axios.put('/user/profile_picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.isUpdatingProfilePicture = false
    } catch (err) {
      this.isUpdatingProfilePicture = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  updateBanner = async file => {
    try {
      this.isUpdatingBanner = true
      let formData = new FormData()
      formData.append('banner', file)

      await axios.put('/user/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.isUpdatingBanner = false
    } catch (err) {
      this.isUpdatingBanner = false
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  //EDUCATION
  @action
  fetchEducation(id) {
    if (!this.profile) return
    if (!this.profile.educations) return
    let education = null

    this.profile.educations.forEach(d => d.id === id && (education = d))
    return education
  }

  @action
  async updateEducation(education, id) {
    try {
      this.isUpdatingEducation = true
      if (id) education.id = id
      
      await axios.put(`/user/education${id ? `/${id}` : ''}`, education)
      
      this.isUpdatingEducation = false
      this.fetchProfile()
      return true
    } catch (err) {
      this.isUpdatingEducation = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  async deleteEducation(id) {
    try {
      this.isDeletingEducation = true
      overlayLoading.show()
      
      await axios.delete(`/user/education/${id}`)
      
      this.isDeletingEducation = false
      this.fetchProfile()
      overlayLoading.hide()
    } catch (err) {
      overlayLoading.hide()
      this.isDeletingEducation = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  //EXPERIENCES
  @action
  async fetchExperience(id) {
    if (!this.profile) return
    if (!this.profile.experiences) return
    let experience = null

    this.profile.experiences.forEach(d => d.id === id && (experience = d))
    return experience
  }

  // @action
  // async fetchExperiences() {
  //   try {
  //     let {
  //       data
  //     } = await axios.get('/user/experience')
  //     this.experiences = data

  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  @action
  async updateExperience(experience, id) {
    try {
      this.isUpdatingExperience = true
      if (id) experience.id = id
      
      await axios.put(`/user/experience${id ? `/${id}` : ''}`, experience)
      
      this.isUpdatingExperience = false
      this.fetchProfile(true)
      return true
    } catch (err) {
      this.isUpdatingExperience = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  @action
  async deleteExperience(id) {
    try {
      this.isDeletingExperience = true
      overlayLoading.show()
      
      await axios.delete(`/user/experience/${id}`)
      
      this.isDeletingExperience = false
      overlayLoading.hide()
      this.fetchProfile()
    } catch (err) {
      overlayLoading.hide()
      this.isDeletingExperience = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  //SKILLS
  @action
  async updateSkills(skills) {
    try {
      this.isUpdatingSkills = true
      
      await axios.put(`/user/skill`, skills)
      
      this.isUpdatingSkills = false
      this.fetchProfile()
    } catch (err) {
      this.isUpdatingSkills = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }

  //COMPANY
  async fetchCompany(id) {
    try {
      this.fetchingCompany = true
      
      let {
        data
      } = await axios.get(`/companies/${id}`)
      
      this.fetchingCompany = false
      return data
    } catch (err) {
      this.fetchingCompany = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE FETCHING PROFILE', err)
    }
  }
}

export default window.profileState = new ProfileState()