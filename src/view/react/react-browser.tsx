import * as React from 'react'
import { hydrate } from 'react-dom'
import ReactApp from './react-app'

hydrate(<ReactApp />, document.getElementById('react-app'))
