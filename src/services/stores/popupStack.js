
import { observable, action, computed } from 'mobx'

class PopupStack {
  @observable popups = []
  
  @action
  push(callback) {
    let id = this.popups.length
    this.popups.push(id)

    if (callback) callback(id)
    return id
  }

  @action
  pop() {
    this.popups.pop()
    return this.popups.length
  }

  @action
  popStackId(id) {
    this.popups.splice(this.popups.indexOf(id), 1)
    return this.popups.length
  }

  @action
  reset() {
    this.popups = []
  }

  @computed
  get isPopupActive() {
    return this.popups.length > 0
  }

  @action
  isAtTop(id) {
    if (this.popups.length > 0) return this.popups[this.popups.length - 1] === id
    return false
  }
}

export default window.popupStack = new PopupStack()