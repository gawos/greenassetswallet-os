import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

export class Auth {
  @persist('object')
  @observable user

  constructor(userPersistentStorage) {
    this.user = userPersistentStorage.user || null
  }

  @action
  login = user => {
    this.user = user
  }

  @action
  logout = () => {
    this.user = null
  }

  init = async () => {}
}

export default Auth
