/*
 * Handles the /root route.
 */

import { Router } from 'express'
import * as React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import ReactIndex from '../view/react/react-index'
import ReactApp from '../view/react/react-app'

const indexRouter = Router()
indexRouter.route('/')
  .get((theReq, theResp) => {
    theResp.write('<!DOCTYPE html>')
    renderToNodeStream(<ReactIndex><ReactApp /></ReactIndex>).pipe(theResp)
  })

export default indexRouter
