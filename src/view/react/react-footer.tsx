import * as React from 'react'
import ReactShadowComp from './react-shadowed-component'
import { reactCommonData } from './react-common-data'
import THE_CSS from './react-footer.css'

export default class ReactFooter extends React.Component {
  // Fields
  static contextType = reactCommonData
  context!: React.ContextType<typeof reactCommonData>

  render() {
    return (<ReactShadowComp tag='footer' style={this.context.commonStyle}>
      <style>{THE_CSS}</style>
      <p>Made by {this.context.commonProps.author}.</p>
    </ReactShadowComp>)
  }
}
