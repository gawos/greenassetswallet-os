import crypto from 'crypto-browserify'

export function make_tuid() {
  return crypto.randomBytes(16).toString('hex')
}
