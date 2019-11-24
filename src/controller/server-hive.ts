/*
 * A module that is essentially a class that represents a server's controller. (Seemed more
 * appropriate to make it a controller because it handles controlling the routes)
 */

import { join } from 'path'
import Conf from '../config/conf'
import SecuConf from '../conf_secu/conf-secu'
import { Server as HttpServer, createServer as createHttpServer } from 'http'
import { Server as HttpsServer, createServer as createHttpsServer } from 'https'
import * as Exp from 'express'
//import BodyParse from 'body-parser'
// import * as ExpSession from 'express-session'
import ViewConsole from '../view/view-console'
import RouterIndex from './index-router'
import RouterSubapp from './subapp-router'

export default class ServerHive {
  // Fields
  private static readonly _ME_STATIC_PATH = 'www'
  private _meIsMaintenance: boolean
  private _meIsSecure: boolean
  private _meViewCons: ViewConsole
  private _meSvrApp: Exp.Application
  private _meSvr!: HttpServer | HttpsServer

  constructor(isSecure: boolean) {
    this._meIsMaintenance = false
    this._meIsSecure = isSecure
    this._meViewCons = new ViewConsole()
    this._meSvrApp = Exp()

    this._meViewCons.addListener(ViewConsole.ViewConsoleEvents.QUIT, () => this.stopServer(true))                         //
    this._meViewCons.addListener(ViewConsole.ViewConsoleEvents.RESTART, this.restartServer.bind(this))                    // Hookup with server's console
    this._meViewCons.addListener(ViewConsole.ViewConsoleEvents.TOGGLE_MAINTENANCE, this.toggleMaintenaceMode.bind(this))  //
    this._meViewCons.startTakeInput()

    //if (process.env?.NODE_ENV !== 'production') // In production, nginx will handle this better
    this._meSvrApp.use(Exp.static(join(process.cwd(), ServerHive._ME_STATIC_PATH))) // So that static requests don't do extra load
    // TODO: Put handlebars content here if needed
    //this._meSvrApp.use(BodyParse.json())                          //
    //this._meSvrApp.use(BodyParse.urlencoded({ extended: true }))  // If needed later
    // this._meSvrApp.use(ExpSession(SecuConf.sessOption))
    this._meSvrApp.use(this._mixedMiddleware.bind(this))

    this._meSvrApp.use('/', RouterIndex)
    this._meSvrApp.use('/subapp', RouterSubapp)

    this._meSvrApp.use((req, resp, next) => resp.status(404).send())
    this._meSvrApp.use(this._errorHandler.bind(this))

    this._meViewCons.displayWelcomeMessage()
  }

  /**
   * Starts the listening server.
   */
  startServer() {
    new Promise(resolve => {
      if (this._meSvr && !this._meSvr.listening) {
        this._meSvr.listen(Conf.port, () => {
          this._meViewCons.displayMessage('Server re-started...')
          resolve()
        })
      } else if (!this._meSvr) {
        this._meSvr = this._meIsSecure ? createHttpsServer(SecuConf.serverTlsOption, this._meSvrApp) : createHttpServer(this._meSvrApp)
        this._meSvr.listen(Conf.port, () => {
          this._meViewCons.displayMessage('Server started...')
          resolve()
        })
      } else {
        resolve()
      }
    }).then(() => {
      if (this._meIsMaintenance) this.toggleMaintenaceMode()
    })
  }

  /**
   * Stops the listening server temporarily or permanently.
   * @param {boolean} isFinalStop  'true' if we need to finalize and cleanup preparing to close server, or false to just temporariy stop the listening server.
   */
  stopServer(isFinalStop: boolean) {
    if (isFinalStop) {
      this._meViewCons.removeAllListeners()
      this._meViewCons.stopTakeInput()
      //this._meSvr.removeAllListeners() // In case we listened to 'upgrade' for websockets
    }
    if (this._meSvr.listening) this._meSvr.close(() => this._meViewCons.displayMessage('Server stopped...')) // Only stop if it's listening
  }

  /**
   * Re-starts the listening server (better not use it to start the server from scrach).
   */
  restartServer() {
    if (this._meSvr.listening) { // Only stop server if it's listening
      this._meSvr.close(() => {
        this._meViewCons.displayMessage('Re-starting server...')
        this.startServer() // Only start server after done closing
      })
    } else {
      this.startServer() // Supposed to be safe to start it now
    }
    this._meViewCons.displayWelcomeMessage() // Display the welcome message again and restart the console page
  }

  /**
   * Toggles the server's maintenance mode.
   */
  toggleMaintenaceMode() {
    this._meIsMaintenance = !this._meIsMaintenance // Flip
    this._meViewCons.displayMessage(this._meIsMaintenance
      ? 'The server is under maintenance mode.'
      : 'The server resumed from maintenance mode.')
  }

  /**
   * A middleware to handle mixed small stuff (that are not worth making as separate).
   * @param {Exp.Request} theReq    the incoming request.
   * @param {Exp.Response} theResp  the outgoing response.
   * @param {Function} next         the function to continue the chain.
   */
  private _mixedMiddleware(theReq: Exp.Request, theResp: Exp.Response, next: Function) {
    if (this._meIsMaintenance) {
      theResp.status(503).send()
    } else {
      next()
    }
  }

  /**
   * A general error handler (to maybe filter the errors later).
   * @param {Error} theErr          the passed error.
   * @param {Exp.Request} theReq    the incoming request.
   * @param {Exp.Response} theResp  the outgoing response.
   * @param {Function} next         the function to continue the chain.
   */
  private _errorHandler(theErr: Error, theReq: Exp.Request, theResp: Exp.Response, next: Function) {
    // This next delegation (in the conditon) is recommended by: http://expressjs.com/en/guide/error-handling.html to
    // suppress any still going requests/responses (this will not happen here, but just in case).
    if (theResp.headersSent) return next(theErr)
    theResp.status(500).send()
  }
}
