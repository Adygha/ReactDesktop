import * as React from 'react'
import ReactShadowComp from './react-shadowed-component'
import { reactFlashMessage } from './react-common-data'
import THE_CSS from './react-flash-message.css'

export default class ReactFlashMessage extends React.Component {
  // Fields
  static contextType = reactFlashMessage
  context!: React.ContextType<typeof reactFlashMessage>

  render() {
    return (<ReactShadowComp mode='open' tag='div'>
      <style>{THE_CSS}</style>
      {this.context.message && <div className={this.context.type}>{this.context.message}</div>}
    </ReactShadowComp>)
  }
}
