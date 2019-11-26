import * as React from 'react'
import ReactShadowComp from './react-shadowed-component'
import ReactFlashMessage from './react-flash-message'
import ReactSideMenu from './react-side-menu'
import { reactCommonData } from './react-common-data'
import THE_CSS from './react-header.css'

export default class ReactHeader extends React.Component {
  // Fields
  static contextType = reactCommonData
  context!: React.ContextType<typeof reactCommonData>

  render() {
    return (<ReactShadowComp tag='header' style={this.context.commonStyle}>
      <style>{THE_CSS}</style>
      <ReactFlashMessage />
      <ReactSideMenu />
      <div className='user-header-container'>
        <div className='user-header user-welcome'>
          {/* // TODO: Prepare a welcome message if logged in */}
        </div>
        <div className='user-header'>
          {/* // TODO: Prepare a user corner */}
        </div>
        <div className='user-header'>
          {/* // TODO: Prepare other user corner */}
        </div>
      </div>
    </ReactShadowComp>)
  }
}
