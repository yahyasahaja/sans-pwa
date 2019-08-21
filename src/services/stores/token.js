import { observable, computed, action } from 'mobx'
import axios from 'axios'
import { ACCESS_TOKEN_STORAGE_URI } from '../../config'
import user from './user'

class Token {
  @observable rawAccessToken = null
  @observable refreshToken = null
  @observable isSettingUp = true

  @computed
  get bearerAccessToken() {
    return `Bearer ${this.rawAccessToken}`
  }

  @action
  async setup() {
    this.isSettingUp = true 
    //get access token
    let access_token = localStorage.getItem(ACCESS_TOKEN_STORAGE_URI)
    if (access_token) {
      this.setAccessToken(access_token)
      await user.getUser()
    }

    this.isSettingUp = false
  }

  @action
  setAccessToken(token) {
    this.rawAccessToken = token
    axios.defaults.headers['Authorization'] = this.bearerAccessToken
    localStorage.setItem(ACCESS_TOKEN_STORAGE_URI, token)
  }
}

export default window.token = new Token()