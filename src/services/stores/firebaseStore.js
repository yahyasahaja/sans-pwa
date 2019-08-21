import { observable } from 'mobx'
import firebase from 'firebase'
import { firebaseConfig } from '../../config'

class Firebase {
  USER_STATE_UNVERIFIED = 'Unverified'
  USER_STATE_VERIFIED = 'Verified'
  USER_STATE_PROFILE_CREATED = 'Profile Created'

  googleAuthProvider

  @observable user
  @observable userState

  init() {
    this.app = firebase.initializeApp(firebaseConfig).auth()
    console.log('initialized')

    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters({
      prompt: 'select_account'
    })
  }

  monitorStateChanged() {
    firebase.auth().onAuthStateChanged(async () => {
      if (firebase.auth().currentUser) {
        this.user = this.getUser(await firebase.auth().currentUser.uid)
      }
    })
  }

  async checkUserState() {
    let currentUser = await firebase.auth().currentUser

    if (currentUser.emailVerified) {
      this.userState = this.USER_STATE_VERIFIED
    } else if (!currentUser.emailVerified) {
      this.userState = this.USER_STATE_UNVERIFIED
    } else if (this.getUser(currentUser.uid)) {
      this.userState = this.USER_STATE_PROFILE_CREATED
    }
  }

  async signUpWithGoogle() {
    try {
      let res = await firebase.auth().signInWithPopup(this.googleAuthProvider)
      console.log('Sign up with Google', res)

      return res
    } catch (e) {
      console.log('ERROR WHILE SIGNING UP WITH GOOGLE', e)
    }
  }

  async signUpWithEmailAndPassword(email, password) {
    try {
      let res = await firebase.auth().createUserWithEmailAndPassword(email, password)
      console.log('Sign up with Email & Password', res)

      this.sendEmailVerification()

      return res
    } catch (e) {
      console.log('ERROR WHILE SIGNING UP WITH EMAIL AND PASSWORD', e)
    }
  }

  async sendEmailVerification() {
    try {
      let res = await firebase.auth().currentUser.sendEmailVerification()
      console.log('Email verification sent', res)

      return res
    } catch (e) {
      console.log('ERROR WHILE SENDING EMAIL VERIFICATION', e)
    }
  }

  async signInWithGoogle() {
    try {
      let res = await firebase.auth().signInWithPopup(this.googleAuthProvider)
      console.log('Sign in with google res', res)

      return res
    } catch (e) {
      console.log('ERROR WHILE SIGNING IN WITH GOOGLE', e)
    }
  }

  async signInWithEmailPassword(email, password) {
    try {
      let res = await firebase.auth().signInWithEmailAndPassword(email, password)
      console.log('Signin with email and password res', res)

      return res
    } catch (err) {
      console.log('ERROR WHILE LOGGING IN WITH EMAIL PASSWORD', err)
    }
  }

  async logout() {
    await firebase.auth().signOut()
  }

  async getUser(uid) {
    return await firebase.firestore().collection('users').doc(uid).get()
  }
}

window.firebase = firebase

export default window.firebaseStore = new Firebase()