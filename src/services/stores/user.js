import { observable, computed, action } from 'mobx'
import axios from 'axios'
import snackbar from './snackbar'
import token from './token'
import { BASE_URL } from '../../config'

class User {
  @observable data = null
  @observable isLoading = false
  @observable isFetchingUsers = false
  @observable isLoadingLogin = false
  @observable isResendingEmail = false

  @computed
  get isLoggedIn() {
    return !!this.data
  }

  @action
  async loginWithGoogle() {
    window.oauthCallback = async access_token => {
      token.setAccessToken(access_token)
      await this.getUser()
    }

    let { protocol, host } = window.location
    // if (host.indexOf('localhost') === 0) host = 'dev.jobwher.com'

    let url = `${
      BASE_URL
    }/oauth2/authorize/google?redirect_uri=${protocol}//${host}/oauth.html`
    window.open(
      url,
      'Oauth Login',
      'height=800,width=600'
    )
  }

  @action
  async login(email, password) {
    try {
      this.isLoadingLogin = true

      let { data: accessToken } = await axios.post('/auth/login', {
        email, password
      })
      
      token.setAccessToken(accessToken)
      await this.getUser()
      this.isLoadingLogin = false

      return accessToken
    } catch(err) {
      this.isLoadingLogin = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE LOGIN', err)
      return err.response
    }
  }

  @action
  async register(body) {
    try {
      this.isLoadingLogin = true

      //TODO
      if (!body.webAddress) body.webAddress = body.email

      let { data: result } = await axios.post('/auth/signup', body)
      
      this.isLoadingLogin = false

      return result
    } catch(err) {
      this.isLoadingLogin = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE LOGIN', err)
    }
  }

  @action
  async getUser() {
    try {
      this.isLoading = true
      let { data } = await axios.get('/auth/currentuser')
      this.data = data
      this.isLoading = false
      console.log(data)
      return data
    } catch (err) {
      this.isLoading = false
      snackbar.show('Error fetching user')
      console.log('ERROR WHILE FETCHING USERS', err)
    }
  }

  @action
  async resendEmail(email) {
    try {
      this.isResendingEmail = true
      await axios.post('/auth/signup/resend', {
        email
      })
      snackbar.show('Email verification sent')

      this.isResendingEmail = false
    } catch (err) {
      this.isResendingEmail = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE RESENDING EMAIL', err.response)
    }
  }

  @action
  async verifyEmail() {
    try {
      let query = new URLSearchParams(window.location.search)
      let token = query.get('token')
      if (token) {
        await axios.get(`/auth/signup/verify?token=${token}`)
        return true
      } else snackbar.show('Given token not valid')
    } catch (err) {
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE VERIFYING EMAIL', err.response)
    }
  }

  @action
  logout = () => {
    localStorage.clear()
    this.data = null
  }
}

export default window.user = new User()