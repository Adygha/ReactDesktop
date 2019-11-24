import * as React from 'react'
import ReactShadowComp from './react-shadowed-component'
import { reactCommonData } from './react-common-data'
import THE_CSS from './react-footer.css'

export default class ReactFooter extends React.Component {
  // Fields
  static contextType = reactCommonData
  context!: React.ContextType<typeof reactCommonData>

  render() {
    return (<ReactShadowComp mode='open' tag='footer'>
      <style>{THE_CSS}</style>
      <footer style={this.context.commonStyle}><p>Made by {this.context.commonProps.author}.</p></footer>
    </ReactShadowComp>)
  }
}
