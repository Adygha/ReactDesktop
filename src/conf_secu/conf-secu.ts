/*
 * This module will contain the server's secure configs (should not push to git repo with real values).
 */

import PkeyCont from './temp-key.key'
import CertCont from './temp-cert.crt'

export default {
  serverTlsOption: {
    key: PkeyCont,
    cert: CertCont
  },
  sessOption: {
    name: 'server.hive',
    secret: 'some-secrete',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 315360000 } // 10 * 365 * 24 * 60 * 60
  }
}