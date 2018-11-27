import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import jwtDecode from 'jwt-decode'

export class Auth {
  constructor(appoloClient) {
    this.appoloClient = appoloClient
  }

  @observable
  ready = null

  @persist('object')
  @observable
  user = null

  @action
  login = res => {
    const { tuid, role } = jwtDecode(res.jwt)
    this.user = {...res, tuid, role }
  }

  @action
  logout = () => {
    this.user = null
  }

  init = async () => {}
}

export default Auth
