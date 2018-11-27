import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

export class Auth {
  constructor(appoloClient) {
    this.appoloClient = appoloClient
  }

  @persist('object')
  @observable
  user = null

  @action
  login = res => {
    this.user = res
  }

  @action
  logout = res => {
    this.user = null
  }

  init = async () => {}
}

export default Auth
