import * as React from 'react'
import ReactShadowComp from './react-shadowed-component'
import { reactCommonData } from './react-common-data'
import THE_CSS from './react-side-menu.css'

export default class ReactSideMenu extends React.Component {
  // Fields
  static contextType = reactCommonData
  context!: React.ContextType<typeof reactCommonData>

  render() {
    return (<ReactShadowComp tag='nav'>
      <style>{THE_CSS}</style>
      <label>
        <input type='radio' className='nav-but' />
        <span className='nav-strips'></span>
        <span className='nav-text'>MENU</span>
        <nav className='nav-menu' style={this.context.commonStyle}>
          {this.context.sideMenu.anchors.map((anch, index) => <a href={anch.href} key={index}>{anch.title}</a>)}
        </nav>
      </label>
    </ReactShadowComp>)
  }
}
