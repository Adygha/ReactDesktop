import Controller from './controller/server-hive'

startUp()

function startUp() {
  let tmpController = new Controller(true)
  tmpController.startServer()
}
