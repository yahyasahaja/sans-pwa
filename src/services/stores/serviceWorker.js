//MODULES
import { observable, action } from 'mobx'
import { APP_INSTALL_STATUS_URI } from '../../config'

//STORE
class ServiceWorker {
  @observable shouldUpdate = false
  @observable countDown = 5
  @observable intervalId = null
  @observable isNotificationAllowed = false
  @observable appInstallationStatus = 'unset'
  @observable isInstallPromptUIShowed = false
  
  deferredAppInstallPrompt = null

  @action
  update() {
    this.countDown = 5
    this.shouldUpdate = true
    this.intervalId = setInterval(() => {
      if (--this.countDown <= 0) this.refreshPage()
    }, 1000)
  }

  refreshPage() {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      if (reg) {
        reg.unregister().then(function() { window.location.reload(true); });
      } else {
         window.location.reload(true);
      }
    });
  }

  async getNotifPermission() {
    const isAllowed =  (await navigator.permissions.query({name:'notifications'})).state
    this.isNotificationAllowed = isAllowed === 'prompt' || isAllowed === 'granted'
  }

  @action
  checkAppInstalledStatus() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Stash the event so it can be triggered later.
      e.preventDefault()
      this.deferredAppInstallPrompt = e
      let status = localStorage.getItem(APP_INSTALL_STATUS_URI)
      if (!status) {
        this.appInstallationStatus = 'unset'
        this.isInstallPromptUIShowed = true
      } else {
        this.appInstallationStatus = status
      }
    })
  }

  @action
  async showAppInstallPrompt() {
    if (!this.deferredAppInstallPrompt) return

    this.isInstallPromptUIShowed = false
    this.deferredAppInstallPrompt.prompt();

    let choiceResult = await this.deferredAppInstallPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      console.log('A2HS accepted')
    } else {
      console.log('A2HS dismissed')
    }

    localStorage.setItem(APP_INSTALL_STATUS_URI, this.appInstallationStatus = choiceResult.outcome)
    this.deferredAppInstallPrompt = null
  }

  @action
  rejectAppInstall() {
    localStorage.setItem(APP_INSTALL_STATUS_URI, this.appInstallationStatus = 'dismissed')
    this.isInstallPromptUIShowed = false
  }
}
 
export default window.sw = new ServiceWorker()
