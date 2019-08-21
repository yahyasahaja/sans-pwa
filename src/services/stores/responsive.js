import { observable } from 'mobx'

class Responsive {
  @observable isMobile = false 
  @observable showWideParallax = false

  constructor() {
    let match = window.matchMedia('(max-width: 800px)')
    let wideParallax = window.matchMedia('(min-width: 1300px)')
    
    if (match.matches) {
      this.isMobile = true
    }

    if (wideParallax.matches) {
      this.showWideParallax = true
    }
  }
}

export default new Responsive()