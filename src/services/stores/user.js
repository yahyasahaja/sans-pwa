import { observable, computed, action } from 'mobx'
import axios from 'axios'
import snackbar from './snackbar'
import token from './token'
import { BASE_URL } from '../../config'
import gql from 'graphql-tag'
import client from '../graphql/client'
import firebaseStore from './firebaseStore';

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
    try {
      this.isLoadingLogin = true

      let res = await firebaseStore.signInWithGoogle()
      let idToken = await res.user.getIdToken()

      let accessToken = await this.customerLogin(idToken)

      return accessToken
    } catch(err) {
      this.isLoadingLogin = false
      snackbar.show(err.message)
      console.log('ERROR WHILE LOGIN WITH GOOGLE', err)
      return err.response
    }
  }

  async loginWithEmailAndPassword(email, password) {
    try {
      this.isLoadingLogin = true

      let res = await firebaseStore.signInWithEmailPassword(email, password)
      let idToken = await res.user.getIdToken()

      let accessToken = this.customerLogin(idToken)

      return accessToken
    } catch (err) {
      this.isLoadingLogin = false
      snackbar.show(err.response.data.message)
      console.log('ERROR WHILE LOGIN WITH EMAIL AND PASSWORD', err)
      return err.response
    }
  }

  @action
  async customerLogin(idToken) {
    try {
      this.isLoadingLogin = true

      let { data: {
        customerLogin: accessToken
      } } = await client.mutate({
        mutation: customerLoginMutation,
        variables: {
          idToken
        }
      })

      console.log(accessToken)
      
      token.setAccessToken(accessToken)
      await this.getUser()
      this.isLoadingLogin = false

      return accessToken
    } catch(err) {
      this.isLoadingLogin = false
      snackbar.show(err)
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

      let { data } = await client.query({
        query: customerQuery,
        fetchPolicy: 'network-only',
      })

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

const customerLoginMutation = gql`
  mutation customerLogin($idToken: String! ) {
    customerLogin(idToken: $idToken)
  }
`

const customerQuery = gql`
  query customer {
    customer {
      id
      uid
      email
      name
      profile_picture
      payment {
        name
        id
      }
    }
  }
`

export default window.user = new User()