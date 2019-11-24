import { EventEmitter } from 'events'
import { writeFileSync, unlinkSync, createWriteStream } from 'fs'

/**
 * A class that represents the view's console.
 */
class ViewConsole extends EventEmitter {
  // Fields
  private static readonly ME_QUIT_COMMAND: string = 'q'
  private static readonly ME_RESTART_COMMAND: string = 'r'
  private static readonly ME_TOG_MAINTENANCE_COMMAND: string = 'p'
  private static readonly ME_WAIT_LINE: string = 'Waiting for input: '
  // private static readonly ME_PID_FILE: string = './pid'
  private _meIsTakeInput: boolean

  constructor() {
    super()
    this._meIsTakeInput = false
  }

  /**
    * Displays the initial welcome message with some initial help.
    */
  displayWelcomeMessage() {
    process.stdout.write('\x1B[2J')
    this.displayMessage('Welcome. Enter \'%s\' to quit the server, or \'%s\' to re-start it, or \'%s\' to toggle server maintenance mode.',
      ViewConsole.ME_QUIT_COMMAND, ViewConsole.ME_RESTART_COMMAND, ViewConsole.ME_TOG_MAINTENANCE_COMMAND)
  }

  /**
   * Displays a message line, and handles 'printf' like formattings exactly like 'console.log'.
   * @param {string} theMessage    theMessage the message to be displayed.
   * @param {any} theOptionals  optionals some other optional parameters to display.
   */
  displayMessage(theMessage: string, ...theOptionals: any) {
    //process.stdout.clearLine()    // Those two don't work on some consoles
    //process.stdout.cursorTo(0)    //
    process.stdout.write('\x1B[2K')     //  Those two lines are just to remove 'Waiting for input:' when new message comes
    process.stdout.write('\x1B[1G')     //
    console.log(theMessage, ...theOptionals)
    if (!process.stdin.isPaused()) {
      process.stdout.write(ViewConsole.ME_WAIT_LINE)
    }
  }

  /**
   * Starts taking input from user.
   */
  startTakeInput() {
    // let tmpBuf = Buffer.alloc(4)
    // tmpBuf.writeInt32LE(process.pid, 0)
    // writeFileSync(ViewConsole.ME_PID_FILE, tmpBuf)
    process.once('SIGINT', () => this.emit(ViewConsole.ViewConsoleEvents.QUIT)) // To handle finishing-up when interrupted
    process.once('SIGTERM', () => this.emit(ViewConsole.ViewConsoleEvents.QUIT)) // To handle finishing-up when interrupted
    process.stdin.resume().addListener('data', buf => {
      let tmpStr = buf.toString().trim()
      switch (tmpStr) {
        case ViewConsole.ME_QUIT_COMMAND:
          this.emit(ViewConsole.ViewConsoleEvents.QUIT) // Inform that 'quit' is requested by user
          break
        case ViewConsole.ME_RESTART_COMMAND:
          this.emit(ViewConsole.ViewConsoleEvents.RESTART) // Inform that 'restart' is requested by user
          break
        case ViewConsole.ME_TOG_MAINTENANCE_COMMAND:
          this.emit(ViewConsole.ViewConsoleEvents.TOGGLE_MAINTENANCE) // Inform that 'toggle-maintenance' is requested by user
          break
        default:
          process.stdout.write('Invalid input.\n' + ViewConsole.ME_WAIT_LINE)
      }
    })
  }

  /**
   * Stops taking input from user.
   */
  stopTakeInput() {
    process.stdin.pause()
    process.stdin.removeAllListeners('data').pause()
    // unlinkSync(ViewConsole.ME_PID_FILE)
  }
}

namespace ViewConsole {

  /**
   * An enumeration that specifies the events the 'ViewConsole' class can emit.
   */
  export enum ViewConsoleEvents {

    /**
     * An event that is emitted when the user requests quitting.
     */
    QUIT = 'quit',

    /**
     * An event that is emitted when the user requests restarting.
     */
    RESTART = 'restart',

    /**
     * An event that is emitted when the user requests to toggle-maintenance status.
     */
    TOGGLE_MAINTENANCE = 'toggle-maintenance'
  }
}

export default ViewConsole
